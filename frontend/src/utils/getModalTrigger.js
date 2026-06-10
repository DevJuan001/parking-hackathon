export function getModalTrigger(e) {
  const buttonElement = e.currentTarget;
  const buttonRect = buttonElement.getBoundingClientRect();
  return { currentTarget: buttonElement, rect: buttonRect };
}
