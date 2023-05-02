import type { Session } from '@remix-run/node';

export type ToastMessage = { message: string; type: 'success' | 'error' };

export function setSuccessMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'success' } as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
  session.flash('toastMessage', { message, type: 'error' } as ToastMessage);
}
