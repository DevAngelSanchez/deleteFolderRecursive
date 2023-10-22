import fs from 'node:fs/promises';
import path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const BASE_DIR = await rl.question("Por favor, ingresa el nombre del directorio base: ");
const FOLDER_TO_DELETE = await rl.question("Por favor, ingrese el nombre de la carpeta que desea borrar: ");
rl.close();

const folderToDelete = async folderPath => {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const isFolder = (await fs.stat(fullPath)).isDirectory();
      if (isFolder) {
        if (file === FOLDER_TO_DELETE) {
          console.log(`Eleminando carpeta "${FOLDER_TO_DELETE}" en "${fullPath}"`);
          await deleteDirectory(fullPath);
        } else {
          await folderToDelete(fullPath);
        }
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

const deleteDirectory = async folderPath => {
  try {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const is_Directory = (await fs.stat(fullPath)).isDirectory();
      if (is_Directory) {
        await deleteDirectory(fullPath);
      } else {
        await fs.unlink(fullPath);
      }
    }
    await fs.rmdir(folderPath);
  } catch (error) {
    console.log("Error: ", error)
  }
}

folderToDelete(BASE_DIR)
  .then(() => {
    console.log("Completado correctamente.");
  })
  .catch(e => console.error("Error: ", e));