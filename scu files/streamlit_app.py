import os
import streamlit as st
import streamlit.components.v1 as components

# Configure Streamlit page for edge-to-edge layout
st.set_page_config(
    page_title="Sound Credit Union DualPath Fintech Engine",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Custom CSS to hide Streamlit default chrome and embed the SPA smoothly
st.markdown(
    """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header[data-testid="stHeader"] {display: none;}
    .block-container {
        padding-top: 0rem !important;
        padding-bottom: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        max-width: 100% !important;
    }
    iframe {
        width: 100% !important;
        min-height: 100vh !important;
        border: none !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

current_dir = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(current_dir, "dist")

if not os.path.isdir(dist_dir) or not os.path.isfile(os.path.join(dist_dir, "index.html")):
    st.error(
        f"Production build not found at `{dist_dir}`. "
        "Please run `npm run build` locally before deploying to generate the production bundle."
    )
else:
    # Declare and render Streamlit custom component pointing to the pre-built dist/ SPA
    sound_cu_component = components.declare_component(
        "sound_cu_dualpath",
        path=dist_dir
    )
    sound_cu_component()
