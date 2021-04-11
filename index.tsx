import * as React from 'react';
import * as ReactDOM from 'react-dom';

declare global {
  interface Window {
    twttr: {
      _e: Array<any>;
      ready: (f: () => void) => void;
      widgets: {
        createTimeline: (data: Record<string, any>, target: HTMLElement) => void;
        load: (el: HTMLElement) => void;
      };
    };
  }
}

type Props = {
  accountName: string;
};

function Twitter(props: Props) {
  const { accountName } = props;

  const divElement = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const id = 'twitter-wjs';
    const scriptElement = document.getElementById(id);

    if (scriptElement) {
      window.twttr.ready(function () {
        console.log('ready');

        if (divElement.current) {
          window.twttr.widgets.load(divElement.current);

          // window.twttr.widgets.createTimeline({
          //   sourceType: 'profile',
          //   screenName: accountName,
          // }, divElement.current);
        }
      });
    } else {
      const t = window.twttr || {};

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };
      t.ready(function () {
        console.log('initializing...');

        if (divElement.current) {
          window.twttr.widgets.load(divElement.current);
        }
      });
      window.twttr = t;

      const script = document.createElement('script');

      script.async = true;
      script.charset = 'utf-8';
      script.id = id;
      script.src = 'https://platform.twitter.com/widgets.js';

      document.head.appendChild(script);
    }
  });

  return (
    <div key={accountName} ref={divElement}>
      <a
        className="twitter-timeline"
        href={`https://twitter.com/${encodeURIComponent(accountName)}`}
      >
        Tweets by {accountName}
      </a>
    </div>
  );
}

function TimelineSwitcher() {
  const [accountName, setAccountName] = React.useState('nintendo');

  const onClick = React.useCallback(() => {
    setAccountName(accountName === 'nintendo' ? 'microsoft' : 'nintendo');
  }, [accountName, setAccountName]);

  return (
    <div>
      <button type="button" onClick={onClick}>
        toggle
      </button>
      <div
        style={{
          border: '1px solid black',
          height: 640,
          width: 320,
          overflow: 'scroll'
        }}
      >
        <Twitter accountName={accountName} />
      </div>
    </div>
  );
}

function onDOMContentLoaded() {
  const element = document.getElementById('js-root');

  if (element) {
    ReactDOM.render(<TimelineSwitcher />, element);
  }
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded, false);
