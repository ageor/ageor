export default class JsonImporter {
    static match(file) {
        return file.endsWith(".json");
    }

    static promise(filePath) {
        return fetch(filePath)
            .then(response => response.json());
    }
};
