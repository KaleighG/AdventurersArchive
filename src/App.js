import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSpellsPage = () => {
    window.open("http://dnd5e.wikidot.com/", "_blank");
  };
  const openRacePage = () => {
    window.open("http://dnd5e.wikidot.com/#toc1", "_blank");
  };
  const openClassPage = () => {
    window.open("http://dnd5e.wikidot.com/#toc19", "_blank");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <div className="menu-options">
          <button className="menuBut" onClick={openSpellsPage}>
            Spells
          </button>
          <button className="menuBut" onClick={openRacePage}>
            Races
          </button>
          <button className="menuBut" onClick={openClassPage}>
            Classes
          </button>
        </div>
      )}
    </div>
  );
};

const CharacterCreation = () => {
  const [showCharacterCreation, setShowCharacterCreation] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [consoleLog, setConsoleLog] = useState("");
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isProceedDisabled, setIsProceedDisabled] = useState(true);
  const [showRace, setShowRace] = useState(false);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [showClickButton, setShowClickButton] = useState(false);
  const [abilities, setAbilities] = useState(Array(6).fill(null));
  const [isRollButtonVisible, setIsRollButtonVisible] = useState(true);
  const [isCharacterDisplayed, setIsCharacterDisplayed] = useState(false);
  const [isShowCharacterVisible, setIsShowCharacterVisible] = useState(false); // State to control visibility of "Show Character" button

  const startCharacterCreation = () => {
    setShowCharacterCreation(false);
  };
  const handleCharacterDisplay = () => {
    setIsCharacterDisplayed(true);
  };
  const handleClassClick = (dndClass) => {
    setSelectedClass(dndClass);
    const log = "Selected D&D Class: " + dndClass.name;
    console.log(log);
    setConsoleLog(log);
    setIsNextDisabled(false);
  };

  const handleRaceClick = (race) => {
    setSelectedRace(race);
    const log = "Selected D&D Race: " + race.name;
    console.log(log);
    setConsoleLog(log);
    setIsProceedDisabled(false);
  };

  const handleProceedClick = () => {
    setShowRace(false);
    setShowCharacterCreation(false);
    setShowClickButton(true);
  };

  const raceAbilityBonuses = {
    Human: { Strength: " +" + 1, Dexterity: " +" + 1 },
    Elf: { Dexterity: " +" + 2, Wisdom: " +" + 1 },
    Dwarf: { Constitution: " +" + 2 },
    Halfling: { Dexterity: " +" + 2 },
    Dragonborn: { Strength: " +" + 2 },
    Gnome: { Intelligence: " +" + 2 },

    Tiefling: { Charisma: " +" + 2 },
  };

  const classAbilityBonuses = {
    Wizard: { Intelligence: " +" + 2 },
    Fighter: { Strength: " +" + 2 },
    Rogue: { Dexterity: " +" + 2 },
    Sorcerer: { Charisma: " +" + 2 },
    Warlock: { Charisma: " +" + 2 },

    Monk: { Dexterity: " +" + 2, Wisdom: " +" + 1 },
    Paladin: { Strength: " +" + 2, Charisma: " +" + 1 },
  };

  const rollAbility = () => {
    const min = 3;
    const max = 18;
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;

    // Find the index of the first null value in the abilities array
    const firstNullIndex = abilities.findIndex((value) => value === null);

    if (firstNullIndex !== -1) {
      // Update the first null value with the random number
      const updatedAbilities = [...abilities];
      updatedAbilities[firstNullIndex] = randomValue;
      setAbilities(updatedAbilities);

      // Check if all abilities have been rolled, and hide the Roll button
      if (firstNullIndex === 5) {
        setIsRollButtonVisible(false);
        setIsShowCharacterVisible(true); // Show "Show Character" button
      }
    }
  };

  useEffect(() => {
    axios
      .get("https://www.dnd5eapi.co/api/classes")
      .then((response) => {
        setClasses(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get("https://www.dnd5eapi.co/api/races")
      .then((response) => {
        setRaces(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="content">
      {showCharacterCreation ? (
        <button className="startBut" onClick={startCharacterCreation}>
          <h2>Start Character Creation</h2>
        </button>
      ) : showRace ? (
        <div className="classPick">
          <h2>Choose a Race: </h2>
          <div className="classPickTitle">
            {races.map((race) => (
              <button
                className="menuBut"
                key={race.index}
                id={race.index}
                onClick={() => handleRaceClick(race)}
              >
                {race.name}
              </button>
            ))}
          </div>
          {selectedRace && (
            <div className="consoleLog">
              <strong>
                <p>{consoleLog}</p>
              </strong>
            </div>
          )}
          <div className="nextBut" id="proceedRace">
            <button
              className="startBut"
              disabled={isProceedDisabled}
              onClick={handleProceedClick}
            >
              <h2>Proceed</h2>
            </button>
          </div>
        </div>
      ) : showClickButton ? (
        <div className="roll-abilities-container">
          {isCharacterDisplayed ? (
            <div className="characterDisplay">
              <h2 className="characterTitle">Class: {selectedClass.name}</h2>
              <h2 className="characterTitle">Race: {selectedRace.name}</h2>
              <div className="characterAbilities">
                <p>
                  Strength: {abilities[0] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Strength ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Strength} from
                      Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Strength ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Strength} from
                      Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  Dexterity: {abilities[1] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Dexterity ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Dexterity} from
                      Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Dexterity ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Dexterity} from
                      Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  Constitution: {abilities[2] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Constitution ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Constitution} from
                      Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Constitution ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Constitution}{" "}
                      from Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  Intelligence: {abilities[3] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Intelligence ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Intelligence} from
                      Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Intelligence ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Intelligence}{" "}
                      from Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  Wisdom: {abilities[4] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Wisdom ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Wisdom} from Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Wisdom ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Wisdom} from
                      Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  Charisma: {abilities[5] || ""}
                  {selectedRace &&
                  raceAbilityBonuses[selectedRace.name]?.Charisma ? (
                    <span>
                      ({raceAbilityBonuses[selectedRace.name].Charisma} from
                      Race)
                    </span>
                  ) : (
                    ""
                  )}
                  {selectedClass &&
                  classAbilityBonuses[selectedClass.name]?.Charisma ? (
                    <span>
                      ({classAbilityBonuses[selectedClass.name].Charisma} from
                      Class)
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="abilitiesLabeled">
              <h3>Strength: {abilities[0] || ""}</h3>
              <h3>Dexterity: {abilities[1] || ""}</h3>
              <h3>Constitution: {abilities[2] || ""}</h3>
              <h3>Intelligence: {abilities[3] || ""}</h3>
              <h3>Wisdom: {abilities[4] || ""}</h3>
              <h3>Charisma: {abilities[5] || ""}</h3>
            </div>
          )}

          {isRollButtonVisible && !isCharacterDisplayed && (
            <button className="rollBut" onClick={rollAbility}>
              <h2>Roll</h2>
            </button>
          )}
          {isShowCharacterVisible && !isCharacterDisplayed && (
            <button
              id="characterBut"
              className="rollBut"
              onClick={handleCharacterDisplay}
            >
              <h2>Show Character</h2>
            </button>
          )}
        </div>
      ) : (
        <div className="classPick">
          <h2>Choose a Class: </h2>
          <div className="classPickTitle">
            {classes.map((dndClass) => (
              <button
                className="menuBut"
                key={dndClass.index}
                id={dndClass.index}
                onClick={() => handleClassClick(dndClass)}
              >
                {dndClass.name}
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="consoleLog">
              <strong>
                <p>{consoleLog}</p>
              </strong>
            </div>
          )}

          <div className="nextBut">
            <button
              className="startBut"
              disabled={isNextDisabled}
              onClick={() => setShowRace(true)}
            >
              <h2>Next</h2>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <div className="top-banner">
        <Menu />
      </div>

      <div className="parchmentBackground">
        <h1>Adventurer's Archive</h1>
        <CharacterCreation />
      </div>
    </div>
  );
};

export default App;
