export function getValueByPath(obj, path, defaultValue) {
    if (!Array.isArray(path)) {
        path = path.split("/").map(field => {
            let index = Number(field);
            if (Number.isInteger(index))
                field = index;
            return field;
        });
    }

    let value = path.reduce((dst, name, index) => {
        if (dst === undefined || !dst.hasOwnProperty(name)) {
            if (index < path.length - 1) {
                return undefined;
            } else {
                return defaultValue;
            }
        }
        return dst[name];
    }, obj);

    return value;
}

export function setStateValueByPath(state, path, value) {
    path = Array.isArray(path) ? path : path.split("/");
    let valueField = path.pop();

    let newState = Array.isArray(state) ? [...state] : {...state};

    let parent = newState;
    path.every(pathNode => {
        let child = parent[pathNode];
        child = Array.isArray(child) ? [...child] : {...child};
        parent[pathNode] = child;
        parent = child;
        return true;
    });
    parent[valueField] = value;

    return newState;
}

export function cloneObject(obj) {
    let newObject = obj;

    if (Array.isArray(obj)) {
        newObject = [];
        obj.every(value => {
            newObject.push(cloneObject(value));
            return true;
        });
    } else if (typeof(obj) === "object") {
        newObject = {};
        Object.keys(obj).every(key => {
            newObject[key] = cloneObject(obj[key]);
            return true;
        });
    }

    return newObject;
}

export function deleteStateValueByPath(state, path, newField=null) {
    path = Array.isArray(path) ? path : path.split("/");
    let valueField = path.pop();

    let newState = Array.isArray(state) ? [...state] : {...state};

    let parent = newState;
    path.every(pathNode => {
        let child = parent[pathNode];
        child = Array.isArray(child) ? [...child] : {...child};
        parent[pathNode] = child;
        parent = child;
        return true;
    });
    if (Array.isArray(parent)) {
        parent.splice(valueField, 1);
    } else {
        delete parent[valueField];
    }

    return newState;
}

export function duplicateStateValueByPath(state, path, newField=null) {
    path = Array.isArray(path) ? path : path.split("/");
    let valueField = path.pop();

    let newState = Array.isArray(state) ? [...state] : {...state};

    let parent = newState;
    path.every(pathNode => {
        let child = parent[pathNode];
        child = Array.isArray(child) ? [...child] : {...child};
        parent[pathNode] = child;
        parent = child;
        return true;
    });
    if (Array.isArray(parent)) {
        newField = (newField !== null) ? newField : valueField + 1;
        parent.splice(valueField + 1, 0, cloneObject(parent[valueField]));
    } else {
        parent[newField] = cloneObject(parent[valueField]);
    }

    return newState;
}

export function compareObjects(obj1, obj2) {
    return Object.keys(obj1).length === Object.keys(obj2).length &&
        Object.keys(obj1).every(key =>
            obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
        );
}

export function setValueByPath(obj, path, value) {
    let field, parentPath, parentObj;
    if (Array.isArray(path)) {
        parentPath = [...path];
        field = parentPath.pop();
        parentObj = getValueByPath(obj, parentPath);
        parentObj[field] = value;
    } else {
        obj[path] = value;
    }
    return obj;
}

export function getRootMatchPath(match) {
    let path = match.path;
    let iColon = path.indexOf('/:');
    if (iColon >= 0)
        path = path.slice(0, iColon);
    return path;
}

export function replaceMatchPathWithParameters(match) {
    let pos = 1;
    let path = match.path;
    let endingSlash = path.endsWith("/");
    if (!endingSlash)
        path += "/";

    while (pos < arguments.length) {
        let name = arguments[pos];
        let value = arguments[pos + 1];
        if (match.params.hasOwnProperty(name)) {
            if (value)
                path = path.replace(':' + name + "/", value + "/");
            else
                path = path.replace(':' + name + "/", "/");
        } else {
            if (value)
                path += value + "/";
        }

        pos += 2;
    }

    if (!endingSlash)
        path = path.slice(0, -1);
    return path;
}

export function filterObject(obj, predicate) {
    return Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => {
            res[key] = obj[key];
            return res
        }, {});
}

