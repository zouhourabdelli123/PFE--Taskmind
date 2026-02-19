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
import { createProjectApi, deleteProjectApi, listProjectsApi, updateProjectApi } from '../../api/projects.api';
import { listTeamsApi } from '../../api/teams.api';

const initialForm = { team_id: '', name: '', description: '', due_date: '' };

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const projectsQuery = useQuery({ queryKey: ['projects'], queryFn: listProjectsApi });
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: listTeamsApi });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return updateProjectApi(editingId, payload);
      }
      return createProjectApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeDialog();
    },
    onError: (err) => setError(getApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  function closeDialog() {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setError('');
  }

  function openCreate() {
    setEditingId(null);
    const firstTeamId = teamsQuery.data?.[0]?.id ?? '';
    setForm({ ...initialForm, team_id: firstTeamId });
    setError('');
    setOpen(true);
  }

  function openEdit(project) {
    setEditingId(project.id);
    setForm({
      team_id: project.team_id ?? '',
      name: project.name ?? '',
      description: project.description ?? '',
      due_date: project.due_date ? dayjs(project.due_date).format('YYYY-MM-DD') : '',
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
      name: form.name,
      description: form.description || null,
      due_date: form.due_date || null,
    };

    if (!editingId) {
      payload.team_id = Number(form.team_id);
    }

    saveMutation.mutate(payload);
  }

  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', minWidth: 180, flex: 1 },
      { field: 'team_id', headerName: 'Team ID', width: 100 },
      {
        field: 'due_date',
        headerName: 'Due Date',
        width: 130,
        valueGetter: (_, row) => (row.due_date ? dayjs(row.due_date).format('YYYY-MM-DD') : '-'),
      },
      { field: 'description', headerName: 'Description', minWidth: 220, flex: 1.2 },
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
            <Typography variant="h4">Projects</Typography>
            <Typography color="text.secondary">Track delivery milestones and ownership.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New Project
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 1 }}>
        <DataGrid
          rows={projectsQuery.data ?? []}
          columns={columns}
          loading={projectsQuery.isLoading}
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </Paper>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Project' : 'Create Project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }} component="form" id="project-form" onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            {!editingId && (
              <TextField
                select
                name="team_id"
                label="Team"
                value={form.team_id}
                onChange={onChange}
                required
                fullWidth
              >
                {(teamsQuery.data ?? []).map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField name="name" label="Name" value={form.name} onChange={onChange} required fullWidth />
            <TextField name="due_date" label="Due date" type="date" value={form.due_date} onChange={onChange} fullWidth InputLabelProps={{ shrink: true }} />
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
          <Button type="submit" form="project-form" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
