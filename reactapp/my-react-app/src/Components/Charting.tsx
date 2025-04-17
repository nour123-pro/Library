import {
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Chart config function
const getChartConfig = (categories: string[], data: number[]) => ({
  type: "bar",
  height: 240,
  series: [
    {
      name: "Books",
      data: data,
    },
  ],
  options: {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#020617"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: "dark",
    },
  },
});

export default function Charting() {
  const [categories, setCategories] = useState<string[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/category/BooksNumbersForEachCategory",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = response.data;
     
     
      const categoryNames = data.map((item: { key: string, value: number }) => item.key);

      // Extract category counts
      const categoryCounts = data.map((item: { key: string, value: number }) => item.value);

      setCategories(categoryNames);
     
      setCounts(categoryCounts);
     
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response?.data;
        if (serverResponse?.errors) {
          alert(serverResponse.errors.join("\n"));
        } else if (serverResponse?.message) {
          alert(serverResponse.message);
        } else {
          alert(error.response?.statusText || "Fetch failed");
        }
      } else {
        alert("An unexpected error occurred");
      }
    }
  };
  useEffect(() => {
   

    fetchData();
  }, [categories]);

  return (
    <Card style={{width:'550px'}}>
      <CardHeader
         floated={false}
         shadow={false}
         color="transparent"
         className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
         title="Accounts Created"
      >
        <div className="bookcategory" style={{backgroundColor:'papayawhip'}}>
          <p >Books Numbers Per Category</p>
          </div>
          </CardHeader>
      <CardBody style={{width:'100%'}}>
        {categories.length > 0 && counts.length > 0 ? (
          <Chart {...getChartConfig(categories, counts)} />
        ) : (
          <p>Loading chart...</p>
        )}
      </CardBody>
    </Card>
  );
}
