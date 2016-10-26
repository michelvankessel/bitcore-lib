'use strict';

var blackcore = module.exports;

// module information
blackcore.version = 'v' + require('./package.json').version;
blackcore.versionGuard = function(version) {
  if (version !== undefined) {
    var message = 'More than one instance of blackcore-lib found. ' + 
      'Please make sure to require blackcore-lib and check that submodules do' +
      ' not also include their own blackcore-lib dependency.';
    throw new Error(message);
  }
};
blackcore.versionGuard(global._bitcore);
global._bitcore = blackcore.version;

// crypto
blackcore.crypto = {};
blackcore.crypto.BN = require('./lib/crypto/bn');
blackcore.crypto.ECDSA = require('./lib/crypto/ecdsa');
blackcore.crypto.Hash = require('./lib/crypto/hash');
blackcore.crypto.Random = require('./lib/crypto/random');
blackcore.crypto.Point = require('./lib/crypto/point');
blackcore.crypto.Signature = require('./lib/crypto/signature');

// encoding
blackcore.encoding = {};
blackcore.encoding.Base58 = require('./lib/encoding/base58');
blackcore.encoding.Base58Check = require('./lib/encoding/base58check');
blackcore.encoding.BufferReader = require('./lib/encoding/bufferreader');
blackcore.encoding.BufferWriter = require('./lib/encoding/bufferwriter');
blackcore.encoding.Varint = require('./lib/encoding/varint');

// utilities
blackcore.util = {};
blackcore.util.buffer = require('./lib/util/buffer');
blackcore.util.js = require('./lib/util/js');
blackcore.util.preconditions = require('./lib/util/preconditions');

// errors thrown by the library
blackcore.errors = require('./lib/errors');

// main bitcoin library
blackcore.Address = require('./lib/address');
blackcore.Block = require('./lib/block');
blackcore.MerkleBlock = require('./lib/block/merkleblock');
blackcore.BlockHeader = require('./lib/block/blockheader');
blackcore.HDPrivateKey = require('./lib/hdprivatekey.js');
blackcore.HDPublicKey = require('./lib/hdpublickey.js');
blackcore.Networks = require('./lib/networks');
blackcore.Opcode = require('./lib/opcode');
blackcore.PrivateKey = require('./lib/privatekey');
blackcore.PublicKey = require('./lib/publickey');
blackcore.Script = require('./lib/script');
blackcore.Transaction = require('./lib/transaction');
blackcore.URI = require('./lib/uri');
blackcore.Unit = require('./lib/unit');

// dependencies, subject to change
blackcore.deps = {};
blackcore.deps.bnjs = require('bn.js');
blackcore.deps.bs58 = require('bs58');
blackcore.deps.Buffer = Buffer;
blackcore.deps.elliptic = require('elliptic');
blackcore.deps._ = require('lodash');
blackcore.deps.scrypt = require('scryptsy');

// Internal usage, exposed for testing/advanced tweaking
blackcore._HDKeyCache = require('./lib/hdkeycache');
blackcore.Transaction.sighash = require('./lib/transaction/sighash');
