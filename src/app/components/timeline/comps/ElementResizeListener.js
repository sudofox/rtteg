import React, {
  useCallback,
  useRef,
  useEffect,
  RefObject,
  MutableRefObject,
} from "react";

const ElementResizeListener = ({onResize}) => {
  const rafRef = useRef(0);
  const objectRef = useRef(null);
  const onResizeRef = useRef(onResize);

  onResizeRef.current = onResize;

  const _onResize = useCallback((e) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      onResizeRef.current(e);
    });
  }, []);

  const onLoad = useCallback(() => {
    const obj = objectRef.current;
    if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
      obj.contentDocument.defaultView.addEventListener("resize", _onResize);
    }
  }, []);

  useEffect(() => {
    return () => {
      const obj = objectRef.current;
      if (obj && obj.contentDocument && obj.contentDocument.defaultView) {
        obj.contentDocument.defaultView.removeEventListener(
          "resize",
          _onResize,
        );
      }
    };
  }, []);

  return (
    <object
      onLoad={onLoad}
      ref={objectRef}
      tabIndex={-1}
      type={"text/html"}
      data={"about:blank"}
      title={""}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        pointerEvents: "none",
        zIndex: -1,
        opacity: 0,
      }}
    />
  );
};

export default ElementResizeListener;
