import { Close } from "@assets/svgs/index";

const Dismiss: React.FC<any> = ({ ...props }) => {
  return (
    <div
      onClick={() => {
        props.dismiss(props.id);
        clearTimeout(props.timeOutId);
      }}
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "30px",
        width: "100%",
        height: "100%",
        zIndex: 2,
        "&:hover": { cursor: "pointer" },
      }}
    >
      <Close width="12px" height="12px" fill="white" />
    </div>
  );
};

export { Dismiss };
