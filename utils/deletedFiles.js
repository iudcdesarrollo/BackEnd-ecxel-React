const fs = require('fs').promises;

/**
 * The `deletedFile` function asynchronously deletes a file at the specified `filePath` and logs a
 * success message or an error message accordingly.
 * @param filePath - The `filePath` parameter in the `deletedFile` function represents the path to the
 * file that you want to delete. This function uses `fs.unlink` to asynchronously delete the file
 * located at the specified `filePath`. If the file is successfully deleted, it logs a success message
 * to the console. If
 */
const deletedFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
        console.log(`Archivo ${filePath} eliminado exitosamente.`);
    } catch (error) {
        console.error(`Error al eliminar el archivo ${filePath}:`, error);
    }
};

module.exports = deletedFile;