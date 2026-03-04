import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // output: 'export',  // uncomment for fully static hosting
})
