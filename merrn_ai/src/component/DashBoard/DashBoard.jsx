
import styles from "./DashBoard.module.css";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import Skeleton from "@mui/material/Skeleton";
import WithAuthHOC from "../utils/HOC/withAuthHOC";
import { useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../utils/HOC/AuthContext";

const Dashboard = () => {
    const [uploadFiletext, setUploadFileText] = useState("Upload your resume");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const handleOnChangeFile = (e) => {
        setResumeFile(e.target.files[0]);
        setUploadFileText(e.target.files[0].name);
    }

    const handleUpload = async () => {
        if (!resumeFile) {
            alert("Please upload your resume");
            return;
        }

        if (!jobDesc) {
            alert("Please enter job description");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("resume", resumeFile);
            formData.append("job_desc", jobDesc);
            formData.append("user", userInfo?._id);

            const response = await axios.post(
                "/resume/addResume",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setResult(response.data);
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }

        setLoading(false);
    }

    return (
        <div className={styles.Dashboard}>

            <div className={styles.DashboardLeft}>

                <div className={styles.DashboardHeader}>
                    <div>
                        <h1>Resume Screening</h1>
                        <p>Analyze your resume with AI</p>
                    </div>

                    <CreditScoreIcon />
                </div>

                <div className={styles.alertInfo}>
                    <p>
                        Upload your resume (PDF only) and paste the job description
                        to analyze your resume.
                    </p>
                </div>

                <div className={styles.DashboardUploadResume}>
                    <label htmlFor="resume" className={styles.UploadBtn}>
                        <CreditScoreIcon />
                        <h3>{uploadFiletext}</h3>
                        <p>Click here to upload your resume</p>
                    </label>

                    <input
                        id="resume"
                        type="file"
                        accept=".pdf"
                        onChange={handleOnChangeFile}
                        style={{ display: "none" }}
                    />
                </div>

                <div className={styles.jobDesc}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => {
                            setJobDesc(e.target.value)
                        }}
                        className={styles.textArea}
                        placeholder='Paste Your Job Description'
                        rows={10}
                        cols={50}
                    />

                    <div
                        className={styles.AnalyzeBtn}
                        onClick={handleUpload}
                    >
                        {loading ? "Analyzing..." : "Analyze"}
                    </div>
                </div>

            </div>

            <div className={styles.DashboardRight}>

                <div className={styles.DashboardRightTopCard}>
                    <div>Analyze With AI</div>

                    <img
                        className={styles.profileImg}
                        src={userInfo?.photoUrl}
                        alt="profile"
                    />

                    <h2>{userInfo?.name}</h2>
                </div>

                {
                    result && <div className={styles.DashboardRightTopCard}>
                        <div>Result</div>

                        <h2>
                            {result.score && `${result.score}%`}
                        </h2>

                        <p>
                            {result.message}
                        </p>

                        <p>
                            {result.summary}
                        </p>
                    </div>
                }

                {
                    loading && <Skeleton
                        variant="rectangular"
                        sx={{ borderRadius: "20px" }}
                        width={280}
                        height={280}
                    />
                }

            </div>

        </div>
    )
}

export default WithAuthHOC(Dashboard)