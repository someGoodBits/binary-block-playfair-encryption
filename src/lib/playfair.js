export function generateSubstitutionMatrix(key = [], size = 0) {
    let len = size * size;
    let matrix = new Array(len).fill(0);
    let visited = new Set();
    let i = 0;

    for (let k = 0; k < key.length; k++) {
        matrix[i++] = key[k].toString(16);
        visited.add(key[k]);
    }

    for (let j = 0; i < len; j++) {
        let v = j.toString(16).toUpperCase();
        if (visited.has(v)) continue;
        matrix[i++] = v;
    }

    return matrix;
}

export function encryptToken(matrix, tokenA, tokenB) {
    if (tokenA === tokenB) return [tokenA, tokenB];
    let len = Math.sqrt(matrix.length);
    let a = matrix.indexOf(tokenA);
    let b = matrix.indexOf(tokenB);
    let ai = a % len;
    let aj = Math.floor(a / len);
    let bi = b % len;
    let bj = Math.floor(b / len);
    let subA, subB;
    if (ai === bi) {
        // same column
        subA = ((aj + 1) % len) * len + ai;
        subB = ((bj + 1) % len) * len + bi;
        // console.log("same col", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    } else if (aj === bj) {
        // same row
        subA = aj * len + ((ai + 1) % len);
        subB = bj * len + ((bi + 1) % len);
        // console.log("same row", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    } else {
        subA = aj * len + bi;
        subB = bj * len + ai;
        // console.log("diag", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    }
}

export function decryptToken(matrix, tokenA, tokenB) {
    if (tokenA === tokenB) return [tokenA, tokenB];
    let len = Math.sqrt(matrix.length);
    let a = matrix.indexOf(tokenA);
    let b = matrix.indexOf(tokenB);
    let ai = a % len;
    let aj = Math.floor(a / len);
    let bi = b % len;
    let bj = Math.floor(b / len);
    let subA, subB;
    if (ai === bi) {
        // same column
        subA = ((aj + len - 1) % len) * len + ai;
        subB = ((bj + len - 1) % len) * len + bi;
        // console.log("same col", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    } else if (aj === bj) {
        // same row
        subA = aj * len + ((ai + len - 1) % len);
        subB = bj * len + ((bi + len - 1) % len);
        // console.log("same row", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    } else {
        subA = aj * len + bi;
        subB = bj * len + ai;
        // console.log("diag", { subA, subB, a, b, ai, aj, bi, bj });
        return [matrix[subA], matrix[subB]];
    }
}

function rol(str, d) {
    d = d % str.length;
    var ans = str.substring(d, str.length) + str.substring(0, d);
    return ans;
}

function ror(str, d) { return rol(str, str.length - d);}

function tokenize(token){
    let code = token.charCodeAt(0);
    let bin = code.toString("2").padStart(8, "0");
    let hexA  = parseInt(bin.slice(0, 4), 2).toString(16).toUpperCase();
    let hexB  = parseInt(bin.slice(4), 2).toString(16).toUpperCase();
    return { token, code, bin, hexA, hexB };
}

function rotateBits(bin,bitShift,i){
    let rbin  = bitShift(bin, i);
    let rbinA = rbin.slice(0, 4);
    let rbinB = rbin.slice(4);
    let rhexA = parseInt(rbinA, 2).toString(16).toUpperCase();
    let rhexB = parseInt(rbinB, 2).toString(16).toUpperCase();
    return {rbin,rhexA,rhexB};
}

export function encryptMessage(subMat, msg) {
    if (msg.length % 2 === 1) msg += "X";
    let encryptedMsg = msg.split("").map(t => tokenize(t));
    encryptedMsg = encryptedMsg.map((msg,i) => ({...msg,...rotateBits(msg.bin,rol,i)}));

    for (let i = 0; i < encryptedMsg.length; i += 2) {
        let tokenA = encryptedMsg[i];
        let tokenB = encryptedMsg[i + 1];
        [tokenA.subHexA, tokenB.subHexA] = encryptToken(subMat, tokenA.rhexA, tokenB.rhexA);
        [tokenA.subHexB, tokenB.subHexB] = encryptToken(subMat, tokenA.rhexB, tokenB.rhexB);
        tokenA.subCode = parseInt(tokenA.subHexA + tokenA.subHexB, 16);
        tokenB.subCode = parseInt(tokenB.subHexA + tokenB.subHexB, 16);
        tokenA.subToken = String.fromCharCode(tokenA.subCode);
        tokenB.subToken = String.fromCharCode(tokenB.subCode);
    }
    console.table(encryptedMsg);
    return encryptedMsg;
}

export function decryptMessage(subMat, msg) {
    let decryptedMsg = msg.split("").map(t => tokenize(t));
    
    for (let i = 0; i < decryptedMsg.length; i += 2) {
        console.log(i)
        let tokenA = decryptedMsg[i];
        let tokenB = decryptedMsg[i + 1];
        [tokenA.subHexA, tokenB.subHexA] = decryptToken(subMat, tokenA.hexA, tokenB.hexA);
        [tokenA.subHexB, tokenB.subHexB] = decryptToken(subMat, tokenA.hexB, tokenB.hexB);
        let subBinA = parseInt(tokenA.subHexA,16).toString(2).padStart(4,"0") + parseInt(tokenA.subHexB,16).toString(2).padStart(4,"0");
        let subBinB = parseInt(tokenB.subHexA,16).toString(2).padStart(4,"0") + parseInt(tokenB.subHexB,16).toString(2).padStart(4,"0");
        tokenA = {...tokenA,...rotateBits(subBinA,ror,i%8)};
        tokenB = {...tokenB,...rotateBits(subBinB,ror,(i+1)%8)};
        tokenA.subCode = parseInt(tokenA.rhexA + tokenA.rhexB, 16);
        tokenB.subCode = parseInt(tokenB.rhexA + tokenB.rhexB, 16);
        tokenA.subToken = String.fromCharCode(tokenA.subCode);
        tokenB.subToken = String.fromCharCode(tokenB.subCode);
        decryptedMsg[i] = tokenA;
        decryptedMsg[i+1] = tokenB;
    }

    console.table(decryptedMsg);
    return decryptedMsg;
}
