import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { mockVSLAs, mockCountries, mockProvinces, mockCommunities, formatCurrency } from '@/data/mockData';
import { HealthScore } from '@/components/HealthScore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search, Building2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { VSLA, Country, Province, Community } from '@/types';

interface VslaFormData {
  name: string;
  countryId: string;
  provinceId: string;
  communityId: string;
  lat: string;
  lng: string;
}

const emptyForm: VslaFormData = { name: '', countryId: '', provinceId: '', communityId: '', lat: '', lng: '' };

export default function VslasPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const permissions = user ? getPermissions(user.role) : null;
  const canManage = permissions?.canManageVslas ?? false;

  const [vslas, setVslas] = useState<VSLA[]>(mockVSLAs);
  const [countries, setCountries] = useState<Country[]>(mockCountries);
  const [provinces, setProvinces] = useState<Province[]>(mockProvinces);
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);

  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVsla, setEditingVsla] = useState<VSLA | null>(null);
  const [deletingVsla, setDeletingVsla] = useState<VSLA | null>(null);
  const [form, setForm] = useState<VslaFormData>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);

  // Inline "Add New" states
  const [addingCountry, setAddingCountry] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCurrencySymbol, setNewCurrencySymbol] = useState('');
  const [newCurrencyCode, setNewCurrencyCode] = useState('');

  const [addingProvince, setAddingProvince] = useState(false);
  const [newProvinceName, setNewProvinceName] = useState('');

  const [addingCommunity, setAddingCommunity] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');

  // Derived lookups
  const getCommunity = (id: string) => communities.find(c => c.id === id);
  const getProvince = (id: string) => provinces.find(p => p.id === id);

  // Filter VSLAs
  const filtered = vslas.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.friendlyId.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = countryFilter === 'all' || v.countryName === countries.find(c => c.id === countryFilter)?.name;
    return matchesSearch && matchesCountry;
  });

  // Inline add handlers
  const handleAddCountry = () => {
    if (!newCountryName.trim() || !newCurrencySymbol.trim() || !newCurrencyCode.trim()) {
      toast({ title: 'Missing fields', description: 'Country name, currency symbol, and currency code are all required.', variant: 'destructive' });
      return;
    }
    const id = `c${Date.now()}`;
    const newCountry: Country = {
      id,
      name: newCountryName.trim(),
      currency: newCurrencyCode.trim().toUpperCase(),
      currencySymbol: newCurrencySymbol.trim(),
      currencyCode: newCurrencyCode.trim().toUpperCase(),
      currencyDecimalPlaces: 0,
    };
    setCountries(prev => [...prev, newCountry]);
    setForm(f => ({ ...f, countryId: id, provinceId: '', communityId: '' }));
    setNewCountryName('');
    setNewCurrencySymbol('');
    setNewCurrencyCode('');
    setAddingCountry(false);
    toast({ title: 'Country Added', description: `${newCountry.name} has been added.` });
  };

  const handleAddProvince = () => {
    if (!newProvinceName.trim()) {
      toast({ title: 'Missing name', description: 'Province name is required.', variant: 'destructive' });
      return;
    }
    const id = `p${Date.now()}`;
    const newProv: Province = { id, name: newProvinceName.trim(), countryId: form.countryId };
    setProvinces(prev => [...prev, newProv]);
    setForm(f => ({ ...f, provinceId: id, communityId: '' }));
    setNewProvinceName('');
    setAddingProvince(false);
    toast({ title: 'Province Added', description: `${newProv.name} has been added.` });
  };

  const handleAddCommunity = () => {
    if (!newCommunityName.trim()) {
      toast({ title: 'Missing name', description: 'Community name is required.', variant: 'destructive' });
      return;
    }
    const id = `cm${Date.now()}`;
    const newCom: Community = { id, name: newCommunityName.trim(), provinceId: form.provinceId };
    setCommunities(prev => [...prev, newCom]);
    setForm(f => ({ ...f, communityId: id }));
    setNewCommunityName('');
    setAddingCommunity(false);
    toast({ title: 'Community Added', description: `${newCom.name} has been added.` });
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('VSLA name is required');
    if (form.name.trim().length > 100) errs.push('Name must be less than 100 characters');
    if (!form.countryId) errs.push('Country is required');
    if (!form.provinceId) errs.push('Province is required');
    if (!form.communityId) errs.push('Community is required');
    if (form.lat && (isNaN(Number(form.lat)) || Number(form.lat) < -90 || Number(form.lat) > 90)) errs.push('Latitude must be between -90 and 90');
    if (form.lng && (isNaN(Number(form.lng)) || Number(form.lng) < -180 || Number(form.lng) > 180)) errs.push('Longitude must be between -180 and 180');
    const duplicate = vslas.find(v => v.name.toLowerCase() === form.name.trim().toLowerCase() && v.communityId === form.communityId && v.id !== editingVsla?.id);
    if (duplicate) errs.push('A VSLA with this name already exists in the selected community');
    return errs;
  };

  const openCreate = () => {
    setEditingVsla(null);
    setForm(emptyForm);
    setErrors([]);
    setDialogOpen(true);
  };

  const openEdit = (vsla: VSLA) => {
    setEditingVsla(vsla);
    const community = getCommunity(vsla.communityId);
    const province = community ? getProvince(community.provinceId) : null;
    const country = province ? countries.find(c => c.id === province.countryId) : null;
    setForm({
      name: vsla.name,
      countryId: country?.id ?? '',
      provinceId: province?.id ?? '',
      communityId: vsla.communityId,
      lat: vsla.lat?.toString() ?? '',
      lng: vsla.lng?.toString() ?? '',
    });
    setErrors([]);
    setDialogOpen(true);
  };

  const openDelete = (vsla: VSLA) => {
    setDeletingVsla(vsla);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const community = getCommunity(form.communityId)!;
    const province = getProvince(community.provinceId)!;
    const country = countries.find(c => c.id === province.countryId)!;

    if (editingVsla) {
      // Update
      setVslas(prev => prev.map(v => v.id === editingVsla.id ? {
        ...v,
        name: form.name.trim(),
        communityId: form.communityId,
        communityName: community.name,
        provinceName: province.name,
        countryName: country.name,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      } : v));
      toast({ title: 'VSLA Updated', description: `${form.name.trim()} has been updated successfully.` });
    } else {
      // Create
      const newId = `v${Date.now()}`;
      const countryCode = country.iso2Code || country.name.substring(0, 2).toUpperCase();
      const friendlyId = `VSLA-${countryCode}-${String(vslas.length + 1).padStart(3, '0')}`;
      const newVsla: VSLA = {
        id: newId,
        friendlyId,
        name: form.name.trim(),
        communityId: form.communityId,
        communityName: community.name,
        provinceName: province.name,
        countryName: country.name,
        memberCount: 0,
        healthScore: 0,
        totalLoans: 0,
        outstandingBalance: 0,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        createdBy: user?.id,
        createdAt: new Date().toISOString(),
      };
      setVslas(prev => [newVsla, ...prev]);
      toast({ title: 'VSLA Created', description: `${form.name.trim()} has been created successfully.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deletingVsla) return;
    setVslas(prev => prev.filter(v => v.id !== deletingVsla.id));
    toast({ title: 'VSLA Deleted', description: `${deletingVsla.name} has been removed.`, variant: 'destructive' });
    setDeleteDialogOpen(false);
    setDeletingVsla(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">VSLA Management</h1>
          <p className="page-subtitle">Create, edit, and manage Village Savings and Loan Associations</p>
        </div>
        {canManage && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New VSLA
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {mockCountries.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-center">Members</TableHead>
              <TableHead className="text-center">Loans</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead className="text-center">Health</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 10 : 9} className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No VSLAs found</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(v => {
                const country = mockCountries.find(c => c.name === v.countryName);
                const symbol = country?.currencySymbol ?? '$';
                return (
                  <TableRow key={v.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{v.friendlyId}</TableCell>
                    <TableCell className="font-medium text-foreground">{v.name}</TableCell>
                    <TableCell>{v.communityName}</TableCell>
                    <TableCell>{v.provinceName}</TableCell>
                    <TableCell>{v.countryName}</TableCell>
                    <TableCell className="text-center">{v.memberCount}</TableCell>
                    <TableCell className="text-center">{v.totalLoans}</TableCell>
                    <TableCell>{formatCurrency(v.outstandingBalance, symbol)}</TableCell>
                    <TableCell className="text-center"><HealthScore score={v.healthScore} size="sm" /></TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDelete(v)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingVsla ? 'Edit VSLA' : 'Create New VSLA'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
                {errors.map((e, i) => (
                  <p key={i} className="text-sm text-destructive">{e}</p>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="vsla-name">VSLA Name *</Label>
              <Input id="vsla-name" placeholder="e.g. Umoja Women Group" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vsla-country">Country *</Label>
              <Select value={form.countryId} onValueChange={v => setForm(f => ({ ...f, countryId: v, provinceId: '', communityId: '' }))}>
                <SelectTrigger id="vsla-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name} ({c.currencySymbol})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vsla-province">Province *</Label>
              <Select value={form.provinceId} onValueChange={v => setForm(f => ({ ...f, provinceId: v, communityId: '' }))} disabled={!form.countryId}>
                <SelectTrigger id="vsla-province">
                  <SelectValue placeholder={form.countryId ? 'Select province' : 'Select country first'} />
                </SelectTrigger>
                <SelectContent>
                  {mockProvinces.filter(p => p.countryId === form.countryId).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vsla-community">Community *</Label>
              <Select value={form.communityId} onValueChange={v => setForm(f => ({ ...f, communityId: v }))} disabled={!form.provinceId}>
                <SelectTrigger id="vsla-community">
                  <SelectValue placeholder={form.provinceId ? 'Select community' : 'Select province first'} />
                </SelectTrigger>
                <SelectContent>
                  {mockCommunities.filter(cm => cm.provinceId === form.provinceId).map(cm => (
                    <SelectItem key={cm.id} value={cm.id}>{cm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="vsla-lat">Latitude</Label>
                <Input id="vsla-lat" type="number" step="any" placeholder="-1.9403" value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vsla-lng">Longitude</Label>
                <Input id="vsla-lng" type="number" step="any" placeholder="29.8739" value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editingVsla ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete VSLA</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete <strong className="text-foreground">{deletingVsla?.name}</strong>?
            This action cannot be undone. All associated members and loans will be affected.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
