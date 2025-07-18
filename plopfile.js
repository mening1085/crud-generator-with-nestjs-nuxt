// ใน plopfile.js
const path = require("path");
const currentFolderName = path.basename(process.cwd());

module.exports = function (plop) {
  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('or', (a, b) => a || b);
  plop.setHelper('get', (obj, key) => obj && obj[key]);
  plop.setHelper('json', obj => JSON.stringify(obj, null, 2));
  plop.setHelper('vueField', name => `{{ row.${name} }}`);
  // Custom action type สำหรับลบ import/module ใน app.module.ts
  plop.setActionType("delete-appmodule-import", function (answers) {
    return new Promise((resolve, reject) => {
      try {
        const fs = require("fs");
        const path = require("path");
        const pascalCaseName =
          answers.entityName.charAt(0).toUpperCase() +
          answers.entityName.slice(1);
        const appModulePath = path.join(
          __dirname,
          `${answers.projectName}-backend/src/app.module.ts`
        );
        if (!fs.existsSync(appModulePath))
          return resolve("app.module.ts not found");
        let lines = fs.readFileSync(appModulePath, "utf8").split("\n");
        // filter out import and module lines
        lines = lines.filter(
          (line) =>
            !line.includes(`import { ${pascalCaseName}Module }`) &&
            !line.trim().startsWith(`${pascalCaseName}Module,`)
        );
        // ลบบรรทัดว่างซ้ำซ้อน
        let content = lines.join("\n").replace(/\n{2,}/g, "\n");
        fs.writeFileSync(appModulePath, content, "utf8");
        resolve("Removed import/module from app.module.ts");
      } catch (err) {
        reject(err);
      }
    });
  });

  
  //! todo: change app folder of frontend
  const appFolder = ''

  // Custom action type สำหรับลบไฟล์ CRUD ทั้งหมด
  plop.setActionType("delete-crud-files", function (answers) {
    return new Promise((resolve, reject) => {
      try {
        const fs = require("fs");
        const path = require("path");
        const pascalCaseName =
          answers.entityName.charAt(0).toUpperCase() +
          answers.entityName.slice(1);
        // ลบ temp-delete-action ก่อน
        const tempDeletePath = path.join(__dirname, "temp-delete-action");
        if (fs.existsSync(tempDeletePath)) {
          fs.unlinkSync(tempDeletePath);
        }
        // ลบ backend files
        const backendFiles = [
          `${answers.projectName}-backend/src/${answers.entityName}/${answers.entityName}.entity.ts`,
          `${answers.projectName}-backend/src/${answers.entityName}/dto/create-${answers.entityName}.dto.ts`,
          `${answers.projectName}-backend/src/${answers.entityName}/dto/update-${answers.entityName}.dto.ts`,
          `${answers.projectName}-backend/src/${answers.entityName}/${answers.entityName}.controller.ts`,
          `${answers.projectName}-backend/src/${answers.entityName}/${answers.entityName}.service.ts`,
          `${answers.projectName}-backend/src/${answers.entityName}/${answers.entityName}.module.ts`,
        ];
        // ลบ frontend files
        const frontendFiles = [
          `${answers.projectName}-frontend/pages/${answers.entityName}/index.vue`,
          `${answers.projectName}-frontend/pages/${answers.entityName}/form.vue`,
        ];
        const allFiles = [...backendFiles, ...frontendFiles];
        allFiles.forEach((filePath) => {
          const fullPath = path.join(__dirname, filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted: ${filePath}`);
          } else {
            console.log(`File not found: ${filePath}`);
          }
        });
        // ลบ use*.ts ที่ตรงกับ entity name (ไม่สน case)
        const composablesDir = path.join(
          __dirname,
          `${answers.projectName}-frontend/${appFolder}composables`
        );
        if (fs.existsSync(composablesDir)) {
          fs.readdirSync(composablesDir).forEach((file) => {
            if (
              file.toLowerCase() === `use${answers.entityName.toLowerCase()}.ts`
            ) {
              fs.unlinkSync(path.join(composablesDir, file));
              console.log(`Deleted: ${composablesDir}/${file}`);
            }
          });
        }
        // ลบโฟลเดอร์ที่ว่าง
        const folders = [
          `${answers.projectName}-backend/src/${answers.entityName}/dto`,
          `${answers.projectName}-backend/src/${answers.entityName}`,
          `${answers.projectName}-frontend/pages/${answers.entityName}`,
        ];
        folders.forEach((folderPath) => {
          const fullPath = path.join(__dirname, folderPath);
          if (
            fs.existsSync(fullPath) &&
            fs.readdirSync(fullPath).length === 0
          ) {
            fs.rmdirSync(fullPath);
            console.log(`Deleted empty folder: ${folderPath}`);
          }
        });
        // ลบ temp-delete-action อัตโนมัติ (ซ้ำเพื่อความชัวร์)
        if (fs.existsSync(tempDeletePath)) {
          fs.unlinkSync(tempDeletePath);
        }
        resolve("Deleted CRUD files and folders");
      } catch (err) {
        reject(err);
      }
    });
  });

  // Generator CRUD (เพิ่มเติม DTO และไฟล์ครบ)
  plop.setGenerator("crud-from-schema", {
    description: "Generate CRUD backend + frontend from schema",
    prompts: [
      {
        type: "input",
        name: "projectName",
        message: "What is your project name?",
        default: "crud-gen",
        validate: (input) => {
          if (input.trim() === "") {
            return "Project name cannot be empty";
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return "Project name can only contain lowercase letters, numbers, and hyphens";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "schemaFile",
        message: "Select schema file",
        choices: () => {
          const fs = require("fs");
          const path = require("path");
          const schemaDir = path.join(__dirname, "tools/schemas");
          return fs
            .readdirSync(schemaDir)
            .filter((f) => f.endsWith(".schema.js"))
            .map((f) => f.replace(".schema.js", ""));
        },
      },
    ],
    actions: (data) => {
      // require schema file
      const path = require("path");
      const schema = require(path.join(__dirname, "tools/schemas", `${data.schemaFile}.schema.js`));
      data.name = schema.name;
      data.fields = schema.fields;


      const actions = [
        // backend
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/${data.name}.entity.ts`,
          templateFile: "tools/templates/backend/entity.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/dto/create-${data.name}.dto.ts`,
          templateFile: "tools/templates/backend/dto/create.dto.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/dto/update-${data.name}.dto.ts`,
          templateFile: "tools/templates/backend/dto/update.dto.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/${data.name}.controller.ts`,
          templateFile: "tools/templates/backend/controller.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/${data.name}.service.ts`,
          templateFile: "tools/templates/backend/service.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-backend/src/${data.name}/${data.name}.module.ts`,
          templateFile: "tools/templates/backend/module.hbs",
          force: true,
        },

        // frontend
        {
          type: "add",
          path: `${data.projectName}-frontend/${appFolder}pages/${data.name}/index.vue`,
          templateFile: "tools/templates/frontend/list.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-frontend/${appFolder}pages/${data.name}/form.vue`,
          templateFile: "tools/templates/frontend/form.hbs",
          force: true,
        },
        {
          type: "add",
          path: `${data.projectName}-frontend/${appFolder}composables/use${data.name}.ts`,
          templateFile: "tools/templates/frontend/useComposable.hbs",
          force: true,
        },

        // แทรก import module ใน app.module.ts
        {
          type: "modify",
          path: `${data.projectName}-backend/src/app.module.ts`,
          pattern: /(\/\/ plop:imports)/g,
          template: `import { {{pascalCase name}}Module } from './{{name}}/{{name}}.module';\n$1`,
        },
        // แทรก module ใน imports array ของ app.module.ts
        {
          type: "modify",
          path: `${data.projectName}-backend/src/app.module.ts`,
          pattern: /(\/\/ plop:modules)/g,
          template: `    {{pascalCase name}}Module,\n  $1`,
        },
      ];

      return actions;
    },
  });

  // Generator ลบ CRUD
  plop.setGenerator("delete-crud", {
    description: "Delete CRUD backend + frontend files",
    prompts: [
      {
        type: "input",
        name: "projectName",
        message: "What is your project name?",
        default: "crud-gen",
        validate: (input) => {
          if (input.trim() === "") {
            return "Project name cannot be empty";
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return "Project name can only contain lowercase letters, numbers, and hyphens";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "entityName",
        message: "Select entity to delete",
        choices: () => {
          const fs = require("fs");
          const path = require("path");
          const schemaDir = path.join(__dirname, "tools/schemas");
          return fs
            .readdirSync(schemaDir)
            .filter((f) => f.endsWith(".schema.js"))
            .map((f) => f.replace(".schema.js", ""));
        },
      },
    ],
    actions: (data) => {
      // สร้าง PascalCase สำหรับ entity name
      const pascalCaseName =
        data.entityName.charAt(0).toUpperCase() + data.entityName.slice(1);

      const actions = [
        // ใช้ custom action type
        {
          type: "delete-appmodule-import",
        },
        // Custom action สำหรับลบไฟล์
        {
          type: "delete-crud-files",
        },
      ];
      return actions;
    },
  });
};
