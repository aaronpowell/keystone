import { KeystoneContext } from '@keystone-next/types';
import { setupTestRunner } from '@keystone-next/testing';
import config from './keystone';

const asUser = (context: KeystoneContext, itemId?: number) =>
  context.withSession({ itemId, data: {} });

const runner = setupTestRunner({ config });

describe(`Example test`, () => {
  test(
    'Create a Person',
    runner(async ({ context }) => {
      const person = await context.lists.Person.createOne({
        data: { name: 'Alice', email: 'alice@example.com', password: 'super-secret' },
        query: 'id name email password { isSet }',
      });
      expect(person.name).toEqual('Alice');
      expect(person.email).toEqual('alice@example.com');
      expect(person.password.isSet).toEqual(true);
    })
  );
});
