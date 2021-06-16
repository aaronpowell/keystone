import { KeystoneContext } from '@keystone-next/types';
import { setupTestEnv, setupTestRunner, TestEnv } from '@keystone-next/testing';
import config from './keystone';

const asUser = (context: KeystoneContext, itemId?: number) =>
  context.withSession({ itemId, data: {} });

const runner = setupTestRunner({ config });

describe('Example tests using test runner', () => {
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

describe('Example tests using test environment', () => {
  let testEnv: TestEnv, context: KeystoneContext;
  let person: { id: string };
  beforeAll(async () => {
    testEnv = await setupTestEnv({ config });
    context = testEnv.testArgs.context;

    await testEnv.connect();

    person = (await context.lists.Person.createOne({
      data: { name: 'Alice', email: 'alice@example.com', password: 'super-secret' },
    })) as { id: string };
  });
  afterAll(async () => {
    await testEnv.disconnect();
  });

  test('Update the persons email address', async () => {
    const { email } = await context.lists.Person.updateOne({
      id: person.id,
      data: { email: 'new-email@example.com' },
      query: 'email',
    });
    expect(email).toEqual('new-email@example.com');
  });
});
