import type { API, ArrayExpression, ASTNode, Literal, ObjectExpression, Property, StringLiteral } from 'jscodeshift';

import assert from 'node:assert/strict';

export const makeUtils = (j: API['jscodeshift']) => {
  function ensureObj(name: string, parent: ASTNode | ASTNode[]): Property {
    return ensure(name, parent, j.objectExpression([]));
  }
  function ensureArr(name: string, parent: ASTNode | ASTNode[]): Property {
    return ensure(name, parent, j.arrayExpression([]));
  }
  function ensure(
    name: string,
    parent: ASTNode | ASTNode[],
    obj: ArrayExpression | ObjectExpression | Literal | StringLiteral /* etc */,
  ): Property {
    let parentCollection: undefined | ASTNode[] = undefined;

    parent = ('node' in parent ? parent.node : parent) as ASTNode;

    if (Array.isArray(parent)) {
      parentCollection = parent;
    } else if (parent.type === 'ObjectExpression') {
      parentCollection = parent.properties;
    } else if (parent.type === 'Property') {
      if (parent.value.type === 'ObjectExpression') {
        parentCollection = parent.value.properties;
      }
    }

    assert(parentCollection, `Failed to determine parentCollection`);

    let result;

    j(parent)
      .find(j.Property, { key: { name } })
      .forEach((path) => {
        result = path;
      });

    if (!result) {
      result = j.property('init', j.identifier(name), obj);
      parentCollection.push(result);
    }
    return result;
  }

  return { ensure, ensureArr, ensureObj };
};
