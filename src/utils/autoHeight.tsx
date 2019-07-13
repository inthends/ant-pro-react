import React, { useState, useEffect, Fragment } from 'react';

function computeHeight(node: HTMLDivElement) {
  const totalHeight = parseInt(getComputedStyle(node).height || '', 10);
  const padding =
    parseInt(getComputedStyle(node).paddingTop || '', 10) +
    parseInt(getComputedStyle(node).paddingBottom || '', 10);
  return totalHeight - padding;
}

function getAutoHeight(n: HTMLDivElement | null) {
  if (!n) {
    return 0;
  }

  let node = n;

  let height = computeHeight(node);

  while (!height) {
    node = node.parentNode as HTMLDivElement;
    if (node) {
      height = computeHeight(node);
    } else {
      break;
    }
  }

  return height;
}

export interface AutoHeightProps {
  height?: number;
}

function autoHeight<T extends AutoHeightProps>() {
  return (WrappedComponent: React.FC<T>) => (props: T) => {
    let root: HTMLDivElement | null;
    const [computedHeight, setComputedHeight] = useState(0);
    const { height } = props;

    useEffect(() => {
      if (!height) {
        setComputedHeight(getAutoHeight(root));
      }
    }, []);

    const handleRoot = (node: HTMLDivElement) => {
      root = node as HTMLDivElement;
    };

    const h = height || computedHeight;
    return (
      <div style={{ height: '100%' }} ref={handleRoot}>
        {h > 0 && <WrappedComponent {...props} height={h} />}
      </div>
    );
  };
}

export default autoHeight;
