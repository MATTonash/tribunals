import React, { useState } from "react";

//A resubale menu component that allows users to choose one out of the drop down list


interface Props {
    options: string[];
    onOptionSelectedChanged?: (newOption: number) => void;
  };


/**
 * 
 * @param options The list of options that this menu will display
 */

export default function Menu({
    options, 
    onOptionSelectedChanged
} : Props) {

    const [experimentSelected, setExperimentSelected] = useState(0)


    const opts = options.map((expID, index) =>
        <option key={index + 1} value={index + 1}>{expID}</option>)

    return (
        <form>
            <select className="expSelect"
                value={experimentSelected}
                onChange={(newSelelectOption) => {
                    const selectedOptionID = newSelelectOption.target.value;
                    setExperimentSelected(Number(selectedOptionID));

                    //Off set the first option
                    onOptionSelectedChanged?.(Number(selectedOptionID) - 1)

                }}>
                <option key="0" value="0" disabled>Choose a file</option>
                {/* <option value="exp_0001">exp_0001</option>
                    <option value="exp_0002">exp_0002</option> */}
                {opts}
            </select>

        </form>)
        

}