var fs = require('fs');
var nodemiral = require('../../');
var path = require('path');

var sshPrivateKey = fs.readFileSync('/Users/boyu/src/scrap/nodemiral/bo-personal-aws-testing-key.pem', 'utf8');
var session = nodemiral.session(
  'ec2-52-53-160-116.us-west-1.compute.amazonaws.com',
  {username: 'ubuntu', pem: sshPrivateKey}, {keepAlive: true}
);

var command = 'sudo docker run -i -p 8888:8888 -p 6006:6006 floydhub/dl-docker:cpu jupyter notebook';

console.log(command);

/*
session.execute(command, function(stdout, stderr) {
  console.log(stdout, stderr);
});
*/

session.executeStream(command, function(err, stream) {
  stream.on('close', function(code, signal) {
    console.log('stream close');
  }).on('data', function(data) {
    data = data.toString();
    console.log('STDOUT ==== ', data);
  }).stderr.on('data', function(data) {
    data = data.toString();
    console.log('STDERR ==== ', data);
  });
});
