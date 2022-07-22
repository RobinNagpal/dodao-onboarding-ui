<template>
  <ul class="tree">
    <slot></slot>
  </ul>
</template>
<style lang="scss" scoped>
.tree {
  padding: 0px;
  margin: 0px;
  list-style: none;
  outline: 0px;
  -webkit-box-flex: 1;
  flex-grow: 1;
  overflow-y: auto;
  :deep(.treeItem) {
    list-style: none;
    margin: 0;
    padding: 0;
    outline: 0;
  }

  :deep(.itemContent) {
    @apply py-2;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  :deep(.iconContainer) {
    margin-right: 4px;
    width: 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    span:after {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      transform: rotate(135deg);

      @apply border-l-2 border-b-2 border-skin-text;
    }
    &.iconCollapse {
      span:after {
        transform: rotate(-45deg);
      }
    }
  }

  :deep(.itemLabel) {
    width: 100%;
    min-width: 0;
    padding-left: 4px;
    position: relative;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
  }

  :deep(.treeItemGroup) {
    height: auto;
    overflow: visible;
    -webkit-transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    transition: height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    margin: 0;
    padding: 0;
    margin-left: 17px;
  }

  :deep(.collapseWrapper) {
    display: flex;
    width: 100%;
  }
}
</style>
