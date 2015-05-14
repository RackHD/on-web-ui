'use strict';

export default decorateComponent;

function decorateComponent({
  contextTypes,
  propTypes,
  defaultProps
}) {
  return function componentDecorator(Component) {
    Component.contextTypes = contextTypes;
    Component.propTypes = propTypes;
    Component.defaultProps = defaultProps;
  };
}
