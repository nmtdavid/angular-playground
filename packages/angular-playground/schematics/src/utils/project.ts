import { Tree } from '@angular-devkit/schematics';
import { getWorkspace, WorkspaceProject } from '@schematics/angular/utility/config';

export function getProjectPath(
  host: Tree,
  options: { project?: string | undefined; path?: string | undefined }
) {
  const project = getProject(host, options);

  if (project && project.root.substr(-1) === '/') {
    project.root = project.root.substr(0, project.root.length - 1);
  }

  if (options.path === undefined) {
    const projectDirName = (project && project.projectType === 'application')
      ? 'app'
      : 'lib';

    const sourceRoot = project && typeof project.sourceRoot === 'string'
      ? project.sourceRoot
      : 'src';
    return project
      ? `${project.root ? `/${project.root}` : ''}/${sourceRoot}/${projectDirName}`
      : '';
  }

  return options.path;
}

export function getProject(host: Tree, options: { project?: string | undefined; path?: string | undefined }): WorkspaceProject | undefined {
  const workspace = getWorkspace(host);

  if (!options.project) {
    const projectNames = Object.keys(workspace.projects);
    // can have no projects if created with `ng new <name> --createApplication=false`
    if (projectNames.length === 0) {
      return undefined;
    }
    options.project = projectNames[0];
  }

  return workspace.projects[options.project];
}
