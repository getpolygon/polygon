export class PartialConfigError extends Error {
  constructor(property: string) {
    super(
      `${property} was not supplied in \`config.yaml\`. Cannot use partial \`${property
        .split(".")[0]
        .replace("`", "")}\` configuration. Consider updating \`config.yaml\``
    );
  }
}
