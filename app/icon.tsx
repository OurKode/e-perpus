import { ImageResponse } from "next/og";

export const size = {
    width: 32,
    height: 32,
};

export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 18,
                    background: "#ffffff",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    fontFamily: "serif",
                    fontWeight: 700,
                    color: "#064E3B",
                    border: "2px solid #064E3B",
                }}
            >
                A
            </div>
        ),
        { ...size }
    );
}
