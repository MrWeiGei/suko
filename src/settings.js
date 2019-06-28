module.exports = {
  title: '舒逸客后台管理系统',

  /**
   * @type {boolean} true | false
   * @description 是否显示设置右面板
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否修复页眉
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧栏中显示徽标
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * 默认值仅在生产环境中使用
   * 如果您也想在dev中使用它，您可以传递['production'， 'development']
   */
  errorLog: ['production', 'development']
}
