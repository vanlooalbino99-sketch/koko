'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db/client';
import { ROLES, isOneOf } from '@/lib/domain';
import { echo, type FormState } from '@/lib/forms';
import { format } from '@/lib/i18n';
import { acceptInvitation, createInvitation, InvitationSchema, revokeInvitation } from '@/lib/organization/invitations';
import {
  changeMemberRole,
  leaveOrganization,
  OrganizationNameSchema,
  removeMember,
  renameOrganization,
  switchOrganization,
  TeamError,
} from '@/lib/organization/service';
import { getI18n, requireAuth } from '@/lib/server/context';
import { appUrl } from '@/lib/server/url';
import { createMissions, deleteMission, MissionSchema } from '@/lib/team/service';

const UUID = /^[0-9a-f-]{36}$/i;

// Les formulaires simples de la page Équipe reviennent sur la page avec un code lisible.
async function onTeamPage(task: () => Promise<unknown>, done: string): Promise<never> {
  let target = `/team?done=${done}`;
  try {
    await task();
  } catch (error) {
    if (!(error instanceof TeamError)) throw error;
    target = `/team?error=${error.code}`;
  }
  revalidatePath('/', 'layout');
  redirect(target);
}

export async function inviteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = InvitationSchema.safeParse({ email: formData.get('email'), role: formData.get('role') });
  if (!parsed.success) return { error: t.common.errorValidation, fieldErrors: { email: t.team.inviteEmailError }, values: echo(formData) };
  try {
    const token = await createInvitation(await getDb(), auth, parsed.data);
    revalidatePath('/team');
    return { ok: `${await appUrl()}/invite/${token}`, values: { email: parsed.data.email } };
  } catch (error) {
    if (error instanceof TeamError) return { error: t.team.errors[error.code], values: echo(formData) };
    throw error;
  }
}

export async function revokeInvitationAction(formData: FormData) {
  const auth = await requireAuth();
  const id = String(formData.get('invitation') ?? '');
  await onTeamPage(async () => {
    if (!UUID.test(id)) throw new TeamError('not_found');
    await revokeInvitation(await getDb(), auth, id);
  }, 'revoked');
}

export async function changeRoleAction(formData: FormData) {
  const auth = await requireAuth();
  const userId = String(formData.get('user') ?? '');
  const role = formData.get('role');
  await onTeamPage(async () => {
    if (!UUID.test(userId)) throw new TeamError('not_found');
    if (!isOneOf(ROLES, role)) throw new TeamError('invalid_role');
    await changeMemberRole(await getDb(), auth, userId, role);
  }, 'role');
}

export async function removeMemberAction(formData: FormData) {
  const auth = await requireAuth();
  const userId = String(formData.get('user') ?? '');
  await onTeamPage(async () => {
    if (!UUID.test(userId)) throw new TeamError('not_found');
    await removeMember(await getDb(), auth, userId);
  }, 'removed');
}

export async function assignMissionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = MissionSchema.safeParse({
    scenarioId: formData.get('scenario'),
    assignee: formData.get('assignee'),
    dueDate: formData.get('due') ?? undefined,
    note: formData.get('note') ?? undefined,
  });
  if (!parsed.success) return { error: t.common.errorValidation, values: echo(formData) };
  try {
    const n = await createMissions(await getDb(), auth, parsed.data);
    revalidatePath('/team');
    return { ok: format(t.team.missionsAssigned, { n }) };
  } catch (error) {
    if (error instanceof TeamError) return { error: t.team.errors[error.code], values: echo(formData) };
    throw error;
  }
}

export async function deleteMissionAction(formData: FormData) {
  const auth = await requireAuth();
  await onTeamPage(async () => deleteMission(await getDb(), auth, String(formData.get('mission') ?? '')), 'mission_deleted');
}

// ─── Invitation, espaces ─────────────────────────────────────────────────────

export async function acceptInvitationAction(formData: FormData) {
  const auth = await requireAuth();
  const token = String(formData.get('token') ?? '');
  let target = '/dashboard';
  try {
    await acceptInvitation(await getDb(), auth, token);
  } catch (error) {
    if (!(error instanceof TeamError)) throw error;
    target = `/invite/${encodeURIComponent(token)}?error=${error.code}`;
  }
  revalidatePath('/', 'layout');
  redirect(target);
}

export async function switchOrganizationAction(formData: FormData) {
  const auth = await requireAuth();
  const id = String(formData.get('organization') ?? '');
  if (UUID.test(id)) await switchOrganization(await getDb(), auth, id);
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function leaveOrganizationAction() {
  const auth = await requireAuth();
  let target = '/dashboard';
  try {
    await leaveOrganization(await getDb(), auth);
  } catch (error) {
    if (!(error instanceof TeamError)) throw error;
    target = `/settings/organization?error=${error.code}`;
  }
  revalidatePath('/', 'layout');
  redirect(target);
}

export async function renameOrganizationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAuth();
  const { t } = await getI18n();
  const parsed = OrganizationNameSchema.safeParse(formData.get('name'));
  if (!parsed.success) return { fieldErrors: { name: t.settings.organizationNameError }, values: echo(formData) };
  try {
    await renameOrganization(await getDb(), auth, parsed.data);
  } catch (error) {
    if (error instanceof TeamError) return { error: t.team.errors[error.code], values: echo(formData) };
    throw error;
  }
  revalidatePath('/', 'layout');
  return { ok: t.settings.renamed, values: { name: parsed.data } };
}
