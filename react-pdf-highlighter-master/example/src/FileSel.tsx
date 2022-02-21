import React from "react"


const FileSel = () => {
    return (
        <div className="description" style={{ padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>Welcome to the Annotation System</h2>
            <p>
                To get started, please select the experiment file and give your name:
            </p>
            <form>
                <select>
                    <option selected disabled>Choose here</option>
                    <option value="1">exp_0001.json</option>
                    <option value="2">exp_0002.json</option>
                    <option value="3">exp_0003.json</option>
                </select>
                <button>Browse</button>
            </form>
            <form>
                <input type="text" placeholder="Enter your name" id="enterName"></input>
                <button>Start</button>
            </form>
        </div>

    );
}

export default FileSel