import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { getApiError } from '../../api/client';
import { listProjectsApi } from '../../api/projects.api';
import { createTaskApi, deleteTaskApi, listTasksApi, updateTaskApi } from '../../api/tasks.api';

const priorities = ['low', 'medium', 'high'];
const initialForm = { project_id: '', title: '', description: '', due_date: '', priority: 'medium', position: 0 };

export function TasksPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const tasksQuery = useQuery({ queryKey: ['tasks'], queryFn: listTasksApi });
  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: listProjectsApi });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return updateTaskApi(editingId, payload);
      }
      return createTaskApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      closeDialog();
    },
    onError: (err) => setError(getApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  function closeDialog() {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setError('');
  }

  function openCreate() {
    setEditingId(null);
    const firstProject = projectsQuery.data?.[0]?.id ?? '';
    setForm({ ...initialForm, project_id: firstProject });
    setError('');
    setOpen(true);
  }

  function openEdit(task) {
    setEditingId(task.id);
    setForm({
      project_id: task.project_id ?? '',
      title: task.title ?? '',
      description: task.description ?? '',
      due_date: task.due_date ? dayjs(task.due_date).format('YYYY-MM-DD') : '',
      priority: task.priority ?? 'medium',
      position: Number(task.position ?? 0),
    });
    setError('');
    setOpen(true);
  }

  function onChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      title: form.title,
      description: form.description || null,
      due_date: form.due_date || null,
      priority: form.priority || null,
      position: Number(form.position) || 0,
    };

    if (!editingId) {
      payload.project_id = Number(form.project_id);
    }

    saveMutation.mutate(payload);
  }

  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'title', headerName: 'Title', minWidth: 180, flex: 1 },
      { field: 'project_id', headerName: 'Project', width: 100 },
      { field: 'priority', headerName: 'Priority', width: 110 },
      {
        field: 'status',
        headerName: 'Status',
        width: 140,
        valueGetter: (_, row) => row.status?.name ?? '-',
      },
      {
        field: 'due_date',
        headerName: 'Due Date',
        width: 130,
        valueGetter: (_, row) => (row.due_date ? dayjs(row.due_date).format('YYYY-MM-DD') : '-'),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => openEdit(row)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteRoundedIcon />}
              onClick={() => deleteMutation.mutate(row.id)}
            >
              Delete
            </Button>
          </Stack>
        ),
      },
    ],
    [deleteMutation],
  );

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Box>
            <Typography variant="h4">Tasks</Typography>
            <Typography color="text.secondary">Prioritize and monitor execution details.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New Task
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 1 }}>
        <DataGrid
          rows={tasksQuery.data ?? []}
          columns={columns}
          loading={tasksQuery.isLoading}
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </Paper>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }} component="form" id="task-form" onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            {!editingId && (
              <TextField
                select
                name="project_id"
                label="Project"
                value={form.project_id}
                onChange={onChange}
                required
                fullWidth
              >
                {(projectsQuery.data ?? []).map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField name="title" label="Title" value={form.title} onChange={onChange} required fullWidth />
            <TextField select name="priority" label="Priority" value={form.priority} onChange={onChange} fullWidth>
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="due_date"
              label="Due date"
              type="date"
              value={form.due_date}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              name="position"
              label="Position"
              type="number"
              value={form.position}
              onChange={onChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={onChange}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button type="submit" form="task-form" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
