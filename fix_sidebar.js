
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'ui', 'sidebar.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove SidebarContext type definition (lines 22-30 approx)
// Looks like:
//   open: boolean;
//   ...
//   toggleSidebar: () => void;
// };
content = content.replace(/open:\s*boolean;[\s\S]+?toggleSidebar:\s*\(\)\s*=>\s*void;\s*};/g, '');

// 2. Fix SidebarProvider forwardRef
// Matches: const SidebarProvider = React.forwardRef & { ... } >(({ ... }, ref) => {
content = content.replace(
    /const SidebarProvider = React\.forwardRef\s*&[\s\S]+?>\(\(({[\s\S]+?}\), ref\)\s*=>\s*{/g,
    'const SidebarProvider = React.forwardRef(({$1}, ref) => {'
);
// Also handle simpler case if the above content match failed due to whitespace
content = content.replace(
    /const SidebarProvider = React\.forwardRef[\s\S]+?>\(\(\{(.+)\},\s*ref\)\s*=>\s*{/g,
    'const SidebarProvider = React.forwardRef(({$1}, ref) => {'
);


// 3. Fix Sidebar forwardRef
content = content.replace(
    /const Sidebar = React\.forwardRef\s*&[\s\S]+?>\(\(({[\s\S]+?}\), ref\)\s*=>\s*{/g,
    'const Sidebar = React.forwardRef(({$1}, ref) => {'
);

// 4. Fix other components with forwardRef & or forwardRef> parens
// Matches: const Name = React.forwardRef ... >(({ ... }, ref) => (
// General pattern: const \w+ = React.forwardRef[...stuff...] >(({ ... }, ref) => 
content = content.replace(
    /const (\w+) = React\.forwardRef[\s\S]+?>\(\(({[\s\S]+?}\), ref\)\s*=>/g,
    'const $1 = React.forwardRef(({$2}, ref) =>'
);

// 5. Remove internal type annotations in function args
// e.g. (open: boolean) =>
content = content.replace(/\(\s*open:\s*boolean\s*\)\s*=>/g, '(open) =>');
content = content.replace(/\(\s*value:\s*boolean\s*\|\s*\(\(value:\s*boolean\)\s*=>\s*boolean\)\)\s*=>/g, '(value) =>');

// 6. Remove generic from useMemo<SidebarContext>
content = content.replace(/React\.useMemo<SidebarContext>/g, 'React.useMemo');

// 7. Remove 'event: KeyboardEvent' definition
content = content.replace(/event:\s*KeyboardEvent/g, 'event');

// 8. Remove lingering 'as React.CSSProperties'
content = content.replace(/as React\.CSSProperties/g, '');

// 9. Remove lingering 'asChild?: boolean' or similar in props
// e.g. open?: boolean
content = content.replace(/\?:\s*boolean/g, '');
content = content.replace(/\?:\s*"[^"]+"/g, '');
content = content.replace(/\?:\s*[a-z]+/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed sidebar.jsx');
