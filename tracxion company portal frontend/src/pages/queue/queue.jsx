import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../context/context";
import CommonLoader from "../../Component/common-loader";
import CommonTable from "../../Component/common-table";
import CommonDeleteDialog from "../../Component/common-delete-dialog";

function Queue() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);


  // queue data
  const [queueData, setQueueData] = useState([
    {
      id: 1,
      queue: "Queue 1",
      description: "Description 1",
    },
    {
      id: 2,
      queue: "Queue 2",
      description: "Description 2",
    },
    {
      id: 3,
      queue: "Queue 3",
      description: "Description 3",
    },
    {
      id: 4,
      queue: "Queue 4",
      description: "Description 4",
    }
  ]);
  const [filteredQueueData, setFilteredQueueData] = useState([]);

  // table data and headers
  const [tableData, setTableData] = useState([]);
  const queueHeaders = [
    {
      title: "Queue",
      value: "queue",
    },
    {
      title: "Description",
      value: "description",
    },
    {
      title: "Actions",
      value: "action",
    },
  ];

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const fetchQueueData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/queue`);
      const data = await response.json();
      console.log("queue data fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error in fetchQueueData", error);
      return [];
    }

  }

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === '') {
      setFilteredQueueData(queueData);
    } else {
      setFilteredQueueData(queueData.filter(queue => queue.queue.toLowerCase().includes(searchValue.toLowerCase())));
    }
  }

  useEffect(() => {
    setPageTitle("All Queues");
    setBreadcrumbs([
      { title: "All Queues", link: "/queue" },
    ]);
    setButtonList([
      {
        type: "search",
        name: "search",
        value: searchTerm,
        onChange: handleSearch,
        inputType: "text"
      },
    ]);
  }, [searchTerm]);
  useEffect(() => {
    const fetchingData = async () => {
      setLoading(true);
      const data = await fetchQueueData();
      // setQueueData(data);
      setLoading(false);
    }
    fetchingData();
  }, [])
  useEffect(() => {
    setFilteredQueueData(queueData);
  }, [queueData]);
  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? queueData : filteredQueueData;
    setTableData(dataToUse);
  }, [queueData, filteredQueueData, searchTerm]);

  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    const queue = queueData.find(queue => queue.id === id);
    console.log("queue", queue);
    if (action === 'delete') {
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Queue');
      setDeleteDialogDescription(`"${queue.queue}" will be deleted permanently. You can't undo this action.`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteQueueSubmit(id));
    }
  }

  const handleDeleteQueueSubmit = (id) => {
    console.log("id to delete", id);
  }

  if (loading) {
    return <CommonLoader text="Loading queue data..." />
  }

  return (
    <div>
      <CommonTable
        tableData={tableData}
        headers={queueHeaders}
        handleActionClick={handleActionClick}
        specificReturn='id'
      />


      <CommonDeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        handleSubmit={deleteDialogHandleSubmit}
      />

    </div>
  );
}

export default Queue;