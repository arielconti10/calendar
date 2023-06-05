export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

const nav: NavItem = {
  title: 'Home',
  href: '/'
}
