import { envMock, exec, mockExecSequence } from '../../../test/exec-util';
import { env, getName } from '../../../test/util';
import { setAdminConfig } from '../../config/admin';
import {
  getPythonAlias,
  parsePythonVersion,
  pythonVersions,
  resetModule,
} from './extract';

jest.mock('child_process');
jest.mock('../../util/exec/env');

describe(getName(), () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    resetModule();

    env.getChildProcessEnv.mockReturnValue(envMock.basic);
    setAdminConfig({ localDir: '/tmp/foo/bar' });
  });
  describe('parsePythonVersion', () => {
    it('returns major and minor version numbers', () => {
      expect(parsePythonVersion('Python 2.7.15rc1')).toEqual([2, 7]);
    });
  });
  describe('getPythonAlias', () => {
    it('returns the python alias to use', async () => {
      const execSnapshots = mockExecSequence(exec, [
        { stdout: '', stderr: 'Python 2.7.17\\n' },
        new Error(),
        { stdout: 'Python 3.8.0\\n', stderr: '' },
        new Error(),
        { stdout: 'Python 3.6.8\\n', stderr: '' },
        new Error(),
      ]);
      const result = await getPythonAlias();
      expect(pythonVersions).toContain(result);
      expect(result).toMatchSnapshot();
      expect(await getPythonAlias()).toEqual(result);
      expect(execSnapshots).toMatchSnapshot();
      expect(execSnapshots).toHaveLength(3);
    });
  });
});
