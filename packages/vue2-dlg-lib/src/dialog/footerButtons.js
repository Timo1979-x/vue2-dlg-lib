export const FOOTER_BUTTONS = {
  OK: 1,
  YES: 2,
  NO: 4,
  CLOSE: 8,
  CANCEL: 16,
};

export const FOOTER_BUTTONS_LIST = [
  { value: FOOTER_BUTTONS.OK, label: 'Ок', action: 'resolve' },
  { value: FOOTER_BUTTONS.YES, label: 'Да', action: 'resolve' },
  { value: FOOTER_BUTTONS.NO, label: 'Нет', action: 'resolve' },
  { value: FOOTER_BUTTONS.CLOSE, label: 'Закрыть', action: 'reject' },
  { value: FOOTER_BUTTONS.CANCEL, label: 'Отмена', action: 'reject' },
];
