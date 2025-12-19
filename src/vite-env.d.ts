/// <reference types="vite/client" />

// Declare figma:asset/ module type for Figma Make Preview compatibility
declare module 'figma:asset/*' {
  const src: string
  export default src
}

