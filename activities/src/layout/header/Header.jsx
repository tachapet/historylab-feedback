import { useEffect, useRef, useState } from 'react'
import "./_header.scss";
import LogoSvg from "../svgs/LogoSvg.jsx";
import { useContext } from "react";
import SaveDataContext from "../../SaveDataContext.jsx";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

/**
 * Component of header in activity. Include switch button with versions. Origin application with some tweaks.
 * */
function Header({ data, formik }) {
  const {
    stateOfActivity,
    updateStateOfActivityBySubmission
  } = useContext(SaveDataContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Verze 2");

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const changeValue = (e) => {
    updateStateOfActivityBySubmission(e.currentTarget.attributes.eventkey.value, formik);
    setSelectedValue(e.currentTarget.textContent)
  }

  const renderDropdown = () => {
    return <Dropdown isOpen={ dropdownOpen } toggle={ toggle }
                     direction={ "down" }>
      <DropdownToggle caret color="secondary">{ selectedValue }</DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Vyberte si verzi odevzdání</DropdownItem>
        <DropdownItem divider/>
        <DropdownItem eventkey={ `1` } onClick={ changeValue }>Verze
          1</DropdownItem>
        <DropdownItem eventkey={ `2` } onClick={ changeValue }>Verze
          2</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  }

  return (
    <header id={ `header` }>
      <div className={ `header-left cviceni-info` }>
        <span className={ `title` }>{ data.name }</span>
        <i className={ `icon-svg` }>
          <LogoSvg/>
        </i>

      </div>
      <div className={ `header-center` }>

      </div>
      <div className={ `header-right` }>
        { stateOfActivity.submission === 2 && stateOfActivity.user === "teacher" &&
          <div className={ `activity-version-select` }>
            Verze cvičení: { renderDropdown() }
          </div> }
      </div>
    </header>
  )
}

export default Header