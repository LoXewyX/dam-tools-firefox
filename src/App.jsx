// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import EventCalendar from './EventCalendar.jsx';
import calendar from './calendar.json';

function StorageRange({
  label,
  storageKey,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}) {
  const handleSliderChange = async (event) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
    await browser.storage.local.set({ [storageKey]: newValue });
  };

  return (
    <div className="grid-container mb-2">
      <label>{label}</label>
      <input
        className="me-2"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={!disabled}
        onChange={handleSliderChange}
      />
      <span>{value}</span>
    </div>
  );
}

StorageRange.propTypes = {
  label: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

function StorageCheckbox({ label, storageKey, checked, onChange }) {
  return (
    <div className="mb-2">
      <label>
        <input
          className="me-2"
          type="checkbox"
          checked={checked}
          onChange={async () => {
            onChange(!checked);
            await browser.storage.local.set({ [storageKey]: !checked });
          }}
        />
        {label}
      </label>
    </div>
  );
}

StorageCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

function StorageText({ label, storageKey, disabled, value, onChange }) {
  const handleTextChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue);
    browser.storage.local.set({ [storageKey]: newValue });
  };

  return (
    <div className="grid-container mb-2">
      <div className="w-2.5">
        <label>{label}</label>
      </div>
      <input
        className="ms-2 w-100"
        type="text"
        value={value}
        disabled={!disabled}
        onChange={handleTextChange}
      />
    </div>
  );
}

StorageText.propTypes = {
  label: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

function App() {
  // Inputs
  const [isCheckedJsInjector, setIsCheckedJsInjector] = useState(false);
  const [isCheckedCssInjector, setIsCheckedCssInjector] = useState(false);
  // const [sliderValue, setSliderValue] = useState(0);
  const [scriptJsTextValue, setScriptJsTextValue] = useState('');
  const [scriptCssTextValue, setScriptCssTextValue] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    browser.storage.local.get('isCheckedJsInjector', function (result) {
      const valueFromStorage = !!result.isCheckedJsInjector;
      if (valueFromStorage !== undefined) {
        setIsCheckedJsInjector(valueFromStorage);
      }
    });

    browser.storage.local.get('isCheckedCssInjector', function (result) {
      const valueFromStorage = !!result.isCheckedCssInjector;
      if (valueFromStorage !== undefined) {
        setIsCheckedCssInjector(valueFromStorage);
      }
    });

    // browser.storage.local.get('sliderValue', function (result) {
    //   const valueFromStorage = result.sliderValue;
    //   if (valueFromStorage !== undefined) {
    //     setSliderValue(valueFromStorage);
    //   }
    // });

    browser.storage.local.get('scriptJsTextValue', function (result) {
      const valueFromStorage = result.scriptJsTextValue;
      if (valueFromStorage !== undefined) {
        setScriptJsTextValue(valueFromStorage);
      }
    });

    browser.storage.local.get('scriptCssTextValue', function (result) {
      const valueFromStorage = result.scriptCssTextValue;
      if (valueFromStorage !== undefined) {
        setScriptCssTextValue(valueFromStorage);
      }
    });
  }, []);

  // Toggles
  const [linksVisible, setLinksVisible] = useState(false);
  const [devtoolsVisible, setDevtoolsVisible] = useState(false);
  const [homeworkVisible, setHomeworkVisible] = useState(false);

  useEffect(() => {
    browser.storage.local.get('linksVisible', function (result) {
      const valueFromStorage = !!result.linksVisible;
      if (valueFromStorage !== undefined) {
        setLinksVisible(valueFromStorage);
      }
    });

    browser.storage.local.get('devtoolsVisible', function (result) {
      const valueFromStorage = !!result.devtoolsVisible;
      if (valueFromStorage !== undefined) {
        setDevtoolsVisible(valueFromStorage);
      }
    });

    browser.storage.local.get('homeworkVisible', function (result) {
      const valueFromStorage = !!result.homeworkVisible;
      if (valueFromStorage !== undefined) {
        setHomeworkVisible(valueFromStorage);
      }
    });
  }, []);

  const toggleLinks = async () => {
    setLinksVisible(!linksVisible);
    await browser.storage.local.set({ linksVisible: !linksVisible });
  };

  const toggleDevtools = async () => {
    setDevtoolsVisible(!devtoolsVisible);
    await browser.storage.local.set({ devtoolsVisible: !devtoolsVisible });
  };

  const toggleHomework = async () => {
    setHomeworkVisible(!homeworkVisible);
    await browser.storage.local.set({ homeworkVisible: !homeworkVisible });
  };

  // Observer animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  const runAction = () => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(async (tabs) => {
        const activeTab = tabs[0];

        if (isCheckedJsInjector) {
          await browser.scripting.executeScript({
            target: {
              tabId: activeTab.id,
            },
            func: (textValue) => {
              const tag_script = document.createElement('script');
              tag_script.innerHTML = textValue;
              document.getElementsByTagName('head')[0].appendChild(tag_script);
            },
            args: [scriptJsTextValue],
            injectImmediately: true,
          });
        }

        // Css injector
        if (isCheckedCssInjector) {
          await browser.scripting.insertCSS({
            target: { tabId: activeTab.id },
            css: scriptCssTextValue,
          });
        } else {
          await browser.scripting.removeCSS({
            target: { tabId: activeTab.id },
            css: scriptCssTextValue,
          });
        }
      });
  };

  return (
    <>
      <div className="card my-4 hidden">
        <div className="row g-0">
          <div className="col-4">
            <img
              className="img-fluid rounded-start unselectable"
              draggable="false"
              src="/img/logo.jpeg"
              alt="dam-tool"
            />
          </div>
          <div className="col-8">
            <div className="card-body">
              <h5 className="card-title">DAM Tools</h5>
              <p className="card-text">{new Date().toLocaleString()}</p>
              <p className="card-text">
                <small className="text-body-secondary me-3">
                  Cret per LoXewyX
                </small>
                <a href="mailto:luis.ruiz@insbaixcamp.cat">
                  <img
                    className="s20 me-2 unselectable"
                    draggable="false"
                    src="/img/envelope.svg"
                    alt="Gmail"
                  />
                </a>
                <a href="https://github.com/LoXewyX/">
                  <img
                    className="s20 me-2 unselectable"
                    draggable="false"
                    src="/img/github.svg"
                    alt="Github"
                  />
                </a>
                <a href="https://loxewyx.bandcamp.com/">
                  <img
                    className="s20 unselectable"
                    draggable="false"
                    src="/img/bandcamp.svg"
                    alt="Bandcamp"
                  />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-4 mb-4 shadow-sm hidden">
        <h2 className="pointer draggable" onClick={toggleLinks}>
          <div className={'caret-btn' + (linksVisible ? ' rotate-90' : '')}>
            <div
              className="unselectable caret"
              draggable="false"
              alt={linksVisible ? 'show' : 'hide'}
            />
          </div>
          Enllaços
          <img
            className="s20 ms-2 unselectable"
            draggable="false"
            src="/img/link.svg"
            alt="Link"
          />
        </h2>
        <hr />
        {linksVisible && (
          <>
            <a href="https://insbaixcamp.cat/">
              <img className="s48 p-2 dropshadow" src="/img/moodle.png" />
              Moodle
            </a>
            <a href="https://insbaixcamp.org/">
              <img className="s48 p-1 dropshadow" src="/img/ibc.png" />
              Ins Baix Camp
            </a>
            <hr />
            <a href="https://chat.openai.com/">
              <img className="s48 p-2 dropshadow" src="/img/chatgpt.png" />
              ChatGPT
            </a>
            <a href="https://loxewyx-chatbot.netlify.app/">
              <img className="s48 p-2 dropshadow" src="/img/netlify.png" />
              Chatbot
            </a>
          </>
        )}
      </div>
      <div className="card p-4 mb-4 shadow-sm hidden">
        <h2 className="pointer draggable" onClick={toggleHomework}>
          <div className={'caret-btn' + (homeworkVisible ? ' rotate-90' : '')}>
            <div
              className="unselectable caret"
              draggable="false"
              alt={homeworkVisible ? 'show' : 'hide'}
            />
          </div>
          Itinerari
          <img
            className="s20 ms-2 unselectable"
            draggable="false"
            src="/img/calendar-days.svg"
            alt="Homework"
          />
        </h2>
        <hr />
        {homeworkVisible && <EventCalendar eventsData={calendar} />}
      </div>
      <div className="card p-4 mb-4 shadow-sm hidden">
        <h2 className="pointer draggable" onClick={toggleDevtools}>
          <div className={'caret-btn' + (devtoolsVisible ? ' rotate-90' : '')}>
            <div
              className="unselectable caret"
              draggable="false"
              alt={devtoolsVisible ? 'show' : 'hide'}
            ></div>
          </div>
          Eines <small className='ms-2' style={{fontSize: ".5em"}}>(Experimental)</small>
          <img
            className="s20 ms-2 unselectable"
            draggable="false"
            src="/img/gear.svg"
            alt="Settings"
          />
        </h2>
        <hr />
        {devtoolsVisible && (
          <div>
            <StorageCheckbox
              label="Injectar scripts JS"
              storageKey="isCheckedJsInjector"
              checked={isCheckedJsInjector}
              onChange={setIsCheckedJsInjector}
            />
            {/* <StorageRange
              label="Rango"
              storageKey="sliderValue"
              value={sliderValue}
              min={0}
              max={10}
              step={1}
              disabled={isCheckedCssInjector}
              onChange={setSliderValue}
            /> */}
            <StorageText
              label="Script"
              storageKey="scriptJsTextValue"
              disabled={isCheckedJsInjector}
              value={scriptJsTextValue}
              onChange={setScriptJsTextValue}
            />
            <hr className="my-4" />
            <StorageCheckbox
              label="Injectar estils"
              storageKey="isCheckedCssInjector"
              checked={isCheckedCssInjector}
              onChange={setIsCheckedCssInjector}
            />
            <StorageText
              label="CSS"
              storageKey="scriptCssTextValue"
              disabled={isCheckedCssInjector}
              value={scriptCssTextValue}
              onChange={setScriptCssTextValue}
            />
            <hr className="my-4" />
            <div className="mt-4 flex-center">
              <button
                id="btnloader"
                className="btn3d btn btn-primary btn-lg"
                onClick={runAction}
              >
                Injectar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
