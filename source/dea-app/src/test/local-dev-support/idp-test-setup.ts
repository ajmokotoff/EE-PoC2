/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import { SSMClient, ParameterType, ParameterTier, PutParameterCommand } from '@aws-sdk/client-ssm';
import minimist from 'minimist';
import { testEnv } from '../../test-e2e/helpers/settings';

const args = minimist(process.argv.slice(2));

const putTestUserCredsInSSMParamStore = async (username: string, password: string) => {
  const ssmClient = new SSMClient({ region: testEnv.awsRegion });
  const idpTestUserSSMPathPrefix = `/dea/${testEnv.stage}-test/idp/idp-test-user-`;

  await ssmClient.send(
    new PutParameterCommand({
      Name: idpTestUserSSMPathPrefix + 'logon',
      Value: username,
      Overwrite: true,
      Type: ParameterType.STRING,
      Tier: ParameterTier.STANDARD,
    })
  );

  await ssmClient.send(
    new PutParameterCommand({
      Name: idpTestUserSSMPathPrefix + 'password',
      Value: password,
      Overwrite: true,
      Type: ParameterType.STRING,
      Tier: ParameterTier.STANDARD,
    })
  );
};

const verifyRequiredParam = (name: string) => {
  if (!args[name]) {
    console.error(`required parameter '--${name}' is unspecified`);
    process.exit(1);
  }
};

verifyRequiredParam('username');
verifyRequiredParam('password');

void putTestUserCredsInSSMParamStore(args.username, args.password);
