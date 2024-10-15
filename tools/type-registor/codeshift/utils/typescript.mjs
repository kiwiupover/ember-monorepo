const Types = new Set(['TSTypeReference', 'TSInterfaceDeclaration']);

export function isIdentifierTypeNode(node) {
	return Types.has(node.parent.value.type);
}
