export function isRelationship(prop) {
	return prop.kind === 'belongsTo' || prop.kind === 'hasMany';
}
