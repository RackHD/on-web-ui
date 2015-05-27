'use strict';

export default decorateComponent;

function decorateComponent({
  childContextTypes,
  contextTypes,
  propTypes,
  defaultProps
}) {
  return function componentDecorator(Component) {
    Component.childContextTypes = childContextTypes;
    Component.contextTypes = contextTypes;
    Component.propTypes = propTypes;
    Component.defaultProps = defaultProps;
  };
}
