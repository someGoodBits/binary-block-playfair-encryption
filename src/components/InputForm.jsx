import { useRef, useState } from "react";
import { ReactComponent as DiceIcon } from "../assets/icons/dice.svg"

const InputForm = ({onEncryption,onDecryption}) => {

    const messageRef = useRef();
    const keyRef = useRef();
    const [msgLength, setMsgLength] = useState(0);

    function handleOnEnc(event) {
        event.preventDefault();
        onEncryption({
            msg : messageRef.current.value,
            key : keyRef.current.value
        });
    }

    function handleOnDec(event) {
        event.preventDefault();
        onDecryption({
            msg : messageRef.current.value,
            key : keyRef.current.value
        });
    }

    function handleClear(){
        messageRef.current.value = "";
        keyRef.current.value = "";
    }

    function handleKeyGen(){
        let charset = "0123456789ABCDEF" ;
        let randomKey = charset.split("").sort(()=>Math.random()>0.5?1:-1).slice(0,6).join("");
        keyRef.current.value = randomKey;
    }

    return ( 
        <div className="w-full space-y-4">
            <div className="relative">
                <label className="block font-bold mb-2 text-gray-700" htmlFor="message-input">Message Input</label>
                <textarea className="block w-full bg-gray-100 min-h-[8rem] focus:outline-none p-4 text-base rounded text-gray-700" onChange={(e)=>setMsgLength(e.target.value.length)} id="message-input" ref={messageRef} required></textarea>
                <div className="absolute top-0 right-0">{ "Message Length : " + msgLength }</div>
            </div>
            <div>
                <label className="block font-bold mb-2 text-gray-700" htmlFor="message-input">Key Input</label>
                <div className="relative">
                    <input className="block w-full bg-gray-100 focus:outline-none h-12 p-4 text-base rounded pr-12 text-gray-700" ref={keyRef} type="text" required/>
                    <button type="button" className="w-12 h-12 absolute right-0 top-0 flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={handleKeyGen}>
                        <DiceIcon stroke={"currentColor"}/>
                    </button>
                </div>
            </div>
            <div className="flex space-x-4">
                <button className="flex-1 p-4 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase" type="button" onClick={handleClear}>Clear</button>
                <button className="flex-1 p-4 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase" onClick={handleOnEnc}>Encrypt</button>
                <button className="flex-1 p-4 rounded bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300 font-semibold uppercase" onClick={handleOnDec}>Decrypt</button>
            </div>
        </div> 
    );
}
 
export default InputForm;