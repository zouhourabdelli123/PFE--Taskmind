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
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useMemo, useState } from 'react';
import { createTeamApi, deleteTeamApi, listTeamsApi, updateTeamApi } from '../../api/teams.api';
import { getApiError } from '../../api/client';

const initialForm = { name: '', description: '' };

export function TeamsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: listTeamsApi });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return updateTeamApi(editingId, payload);
      }
      return createTeamApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      closeDialog();
    },
    onError: (err) => setError(getApiError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });

  function closeDialog() {
    setOpen(false);
    setEditingId(null);
    setForm(initialForm);
    setError('');
  }

  function openCreate() {
    setEditingId(null);
    setForm(initialForm);
    setError('');
    setOpen(true);
  }

  function openEdit(team) {
    setEditingId(team.id);
    setForm({ name: team.name ?? '', description: team.description ?? '' });
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
    saveMutation.mutate({
      name: form.name,
      description: form.description || null,
    });
  }

  const columns = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
      { field: 'description', headerName: 'Description', flex: 1.4, minWidth: 220 },
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
            <Typography variant="h4">Teams</Typography>
            <Typography color="text.secondary">Manage your collaboration groups.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New Team
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 1 }}>
        <DataGrid
          rows={teamsQuery.data ?? []}
          columns={columns}
          loading={teamsQuery.isLoading}
          disableRowSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        />
      </Paper>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Team' : 'Create Team'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }} component="form" id="team-form" onSubmit={onSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField name="name" label="Name" value={form.name} onChange={onChange} required fullWidth />
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
          <Button type="submit" form="team-form" variant="contained" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
