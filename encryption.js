/**
 * Created by cprice on 4/1/16.
 */

var check   = require('check-types');
var jinx = require('./jinx-lib.js');
var vorpal = require('vorpal')();

var KEY_SIZE = 10;
var KEY_CHUNK_SIZE = 5;


function intoChunks(array, chunk_size, process){
    for(var i = 0; i < array.length; i+=  chunk_size){
        process(array.slice(i, i + chunk_size));
    }
}

function parseStr2Bool(string){
    return string.split('').map(function (char) {
        return char == '1';
    });
}

function convertStrToBits(string){
    var res = "";
    string.split('').forEach(function (char)
    {
        res += char.toString().charCodeAt(0).toString(2);
    });
    return res;
}

function flatten(array){
    return [].concat.apply([], array);
}

function convertBits2Str(array){
    var result = "";
    array.map(function (bits)
    {
        result += String.fromCharCode(parseInt(bits, 2));
    });
    return result;
}

function xorArray(t1, t2){
    check.assert.array(t1);
    return t1.map(function (val, i) {
        return val ^ t2[i];
    });
}


module.exports = {
    encrypt : function (message, key) {
        var subkeys = this.generateSubKeys(key), res = [];
        var messageBits = convertStrToBits(message);
        vorpal.log(messageBits);
        for(var i= 0; i < messageBits.length; i+=8){
            res = res.concat( xorArray(messageBits.split('').slice(i, i + 8), subkeys[0]));
        }
        vorpal.log(res);
    },

    generateSubKeys : function(key10){
        key10 = parseStr2Bool(key10);
        var key = this.circularShift(this.P10(key10), 1);
        var k1 = this.P8(key);
        var k2 = this.P8(this.circularShift(key, 2));
        return [k1, k2];
    },

    // Key must be an array of 10 bits long
    P10 : function(originalKey){
        check.assert.array.of.boolean(originalKey);
        check.assert.equal(originalKey.length, KEY_SIZE);

        return [
            originalKey[2],
            originalKey[4],
            originalKey[1],
            originalKey[6],
            originalKey[3],
            originalKey[9],
            originalKey[0],
            originalKey[8],
            originalKey[7],
            originalKey[5]
        ];
    },

    P8: function(originalKey){
        check.assert.array.of.boolean(originalKey);
        check.assert.equal(originalKey.length, 10);

        return [
            originalKey[5],
            originalKey[2],
            originalKey[6],
            originalKey[3],
            originalKey[7],
            originalKey[4],
            originalKey[9],
            originalKey[8]
        ];
    },

    IP : function(plaintext){
        check.assert.equal(plaintext.length, 8);

        return [
            plaintext[1],
            plaintext[5],
            plaintext[2],
            plaintext[0],
            plaintext[3],
            plaintext[7],
            plaintext[4],
            plaintext[6]
        ];
    },

    RIP : function(plaintext){
        check.assert.equal(plaintext.length, 8);

        return [
            plaintext[3],
            plaintext[0],
            plaintext[2],
            plaintext[4],
            plaintext[6],
            plaintext[1],
            plaintext[7],
            plaintext[5]
        ];
    },

    EP : function(input){
        check.assert.array.of.boolean(input);
        check.assert.equal(input.length, 4);
        return [
            input[3],
            input[0],
            input[1],
            input[2],
            input[1],
            input[2],
            input[3],
            input[0]
        ];
    },

    // Shift a key with a given number of bits
    circularShift : function(key, bits){
        check.assert.less(bits, KEY_CHUNK_SIZE);
        var shiftedKey = [];
        intoChunks(key, KEY_CHUNK_SIZE, function(chunk){
            shiftedKey = shiftedKey.concat(chunk.slice(bits, KEY_CHUNK_SIZE), (chunk.slice(0, bits)));
        });
        return shiftedKey;
    },

    test : function(args){
        this.encrypt("je suis!", "1001001100");

    }
};