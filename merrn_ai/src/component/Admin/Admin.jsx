import React, { useState, useEffect, useContext } from "react";
import styles from "./admin.module.css";
import { Skeleton } from "@mui/material";
import WithAuthHOC from "../utils/HOC/withAuthHOC";
import axios from "../utils/axios";
import { AuthContext } from "../utils/HOC/AuthContext";

const Admin = () => {

    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {

        const fetchAllData = async () => {
            setLoader(true);

            try {
                const response = await axios.get('/resume/get', {
                    headers: {
                        'x-user-id': userInfo?._id
                    }
                });

                setData(response.data.resume);
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        }

        if (userInfo?._id) {
            fetchAllData();
        }
    }, [userInfo]);

    return (
        <div className={styles.Admin}>
            <div className={styles.AdminBlock}>

                {
                    loader && <>
                        <Skeleton
                            variant="rectangular"
                            width={266}
                            height={400}
                            sx={{ borderRadius: "20px" }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width={266}
                            height={400}
                            sx={{ borderRadius: "20px" }}
                        />
                        <Skeleton
                            variant="rectangular"
                            width={266}
                            height={400}
                            sx={{ borderRadius: "20px" }}
                        />
                    </>
                }

                {
                    Array.isArray(data) && data.map((item, index) => {
                        return (
                            <div
                                key={item._id}
                                className={styles.AdminCard}
                            >
                                <h2>{item?.user?.name || "Unknown"}</h2>

                                <p>
                                    Email : {item?.user?.email || "Unknown"}
                                </p>

                                <p>
                                    Resume Name : {item?.resume_name}
                                </p>

                                <p>
                                    Score : {item?.score}%
                                </p>

                                <p>
                                    {item?.feedback}
                                </p>

                                <p>
                                    Dated : {item?.createdAt?.slice(0, 10)}
                                </p>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default WithAuthHOC(Admin);