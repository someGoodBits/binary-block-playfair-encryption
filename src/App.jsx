import { useState } from "react";
import InputForm from "./components/InputForm";
import Matrix from "./components/Matrix";
import Table from "./components/Table";
import { generateSubstitutionMatrix, encryptMessage, decryptMessage } from "./lib/playfair";

function App() {

    const [matrix, setMatrix] = useState([]);
    const [encryptionTable, setEncryptionTable] = useState([]);
    const [decryptionTable, setDecryptionTable] = useState([]);
    const [encryptedMsg, setEncryptedMsg] = useState("");

    function handleOnEncryption(formData){
        console.log({formData});
        let keyList = formData.key.toUpperCase().split("");
        let subMat = generateSubstitutionMatrix(keyList,4);
        setMatrix(subMat);
        let encTable = encryptMessage(subMat,formData.msg);
        setEncryptedMsg(encTable.map(t=>t.subToken).join(""));
        setEncryptionTable(encTable);
        console.log("Here")
    }

    function handleOnDecryption(formData){
        console.log({formData});
        let keyList = formData.key.toUpperCase().split("");
        let subMat = generateSubstitutionMatrix(keyList,4);
        setMatrix(subMat);
        console.log(encryptedMsg)
        let decTable = decryptMessage(subMat,encryptedMsg);
        setDecryptionTable(decTable);
    }

    return (
        <div className="p-4">
            <div className="w-full max-w-2xl mx-auto p-2 space-y-4">
                <div>
                    <InputForm onEncryption={handleOnEncryption} onDecryption={handleOnDecryption}/>
                </div>
                <div>
                    <h3 className="text-base font-bold mb-3 text-gray-700">Substitution Matrix</h3>
                    <Matrix data={matrix} size={4} />
                </div>
            </div>
            <div>
                <h3 className="text-center text-base font-bold mb-3 text-gray-700 my-8">Encryption</h3>
                <Table data={encryptionTable}/>
            </div>
            <div>
                <h3 className="text-center text-base font-bold mb-3 text-gray-700 my-8">Decryption</h3>
                <Table data={decryptionTable} decryption={true}/>
            </div>
        </div>
    );
}

export default App;
