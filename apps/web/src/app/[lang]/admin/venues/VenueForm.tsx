'use client';

import { useActionState } from 'react';
import { Alert, buttonStyles, Field, Input, Select, inputStyles } from '@/components/ui';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Venue } from '@/lib/match-data';
import { deleteVenueAction, saveVenueAction, type VenueFormState } from './actions';

interface VenueFormProps {
    locale: Locale;
    venue?: Venue;
    dict: Pick<Dictionary, 'admin' | 'match'>;
}

export default function VenueForm({ locale, venue, dict }: VenueFormProps) {
    const t = dict.admin;
    const [state, action, pending] = useActionState<VenueFormState, FormData>(saveVenueAction, {});
    const [deleteState, deleteAction, deleting] = useActionState<VenueFormState, FormData>(
        deleteVenueAction,
        {},
    );
    const v = (key: string, fallback: string | number | null | undefined) =>
        state.values?.[key] ?? (fallback === null || fallback === undefined ? '' : String(fallback));
    const fe = (key: keyof NonNullable<VenueFormState['fieldErrors']>) => {
        const k = state.fieldErrors?.[key];
        return k ? t.errors[k] : undefined;
    };
    const checked = (key: string, fallback: boolean) =>
        state.values ? state.values[key] === 'on' : fallback;

    return (
        <div className="space-y-6">
            <form action={action} className="space-y-5" noValidate>
                <input type="hidden" name="lang" value={locale} />
                {venue && <input type="hidden" name="venueId" value={venue.id} />}
                {state.error && <Alert tone="error">{t.errors[state.error]}</Alert>}

                <Field label={t.name} htmlFor="name" error={fe('name')}>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={v('name', venue?.name)}
                        required
                        maxLength={120}
                    />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t.address} htmlFor="address" error={fe('address')}>
                        <Input
                            id="address"
                            name="address"
                            defaultValue={v('address', venue?.address)}
                            required
                        />
                    </Field>
                    <Field label={t.area} htmlFor="area" error={fe('area')}>
                        <Input id="area" name="area" defaultValue={v('area', venue?.area)} required />
                    </Field>
                </div>
                <Field label={t.mapsUrl} htmlFor="mapsUrl" error={fe('mapsUrl')} hint={t.mapsUrlHint}>
                    <Input
                        id="mapsUrl"
                        name="mapsUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://maps.app.goo.gl/…"
                        defaultValue={v('mapsUrl', venue?.maps_url)}
                        required
                        maxLength={500}
                    />
                </Field>
                <Field label={t.surface} htmlFor="surface">
                    <Select
                        id="surface"
                        name="surface"
                        defaultValue={v('surface', venue?.surface ?? 'artificial_turf')}
                    >
                        {(['artificial_turf', 'grass', 'indoor'] as const).map((surface) => (
                            <option key={surface} value={surface}>
                                {dict.match.surfaces[surface]}
                            </option>
                        ))}
                    </Select>
                </Field>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="changingRooms"
                            defaultChecked={checked('changingRooms', venue?.has_changing_rooms ?? false)}
                            className="h-4 w-4 accent-primary-strong"
                        />
                        {t.changingRooms}
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="lights"
                            defaultChecked={checked('lights', venue?.has_lights ?? true)}
                            className="h-4 w-4 accent-primary-strong"
                        />
                        {t.lights}
                    </label>
                </div>
                <Field label={t.notes} htmlFor="notes">
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        maxLength={500}
                        defaultValue={v('notes', venue?.notes)}
                        className={inputStyles}
                    />
                </Field>
                <button type="submit" disabled={pending} className={buttonStyles.primary}>
                    {t.save}
                </button>
            </form>

            {venue && (
                <form
                    action={deleteAction}
                    onSubmit={(e) => {
                        if (!window.confirm(t.deleteConfirm)) e.preventDefault();
                    }}
                    className="space-y-3 border-t border-black/10 pt-6"
                >
                    <input type="hidden" name="lang" value={locale} />
                    <input type="hidden" name="venueId" value={venue.id} />
                    {deleteState.error && <Alert tone="error">{t.errors[deleteState.error]}</Alert>}
                    <button type="submit" disabled={deleting} className={buttonStyles.danger}>
                        {t.delete}
                    </button>
                </form>
            )}
        </div>
    );
}
