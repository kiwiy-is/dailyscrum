export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      daily_scrum_update_answers: {
        Row: {
          answer: string;
          created_at: string;
          daily_scrum_update_entry_id: number;
          daily_scrum_update_question_id: number;
          id: number;
        };
        Insert: {
          answer?: string;
          created_at?: string;
          daily_scrum_update_entry_id: number;
          daily_scrum_update_question_id: number;
          id?: number;
        };
        Update: {
          answer?: string;
          created_at?: string;
          daily_scrum_update_entry_id?: number;
          daily_scrum_update_question_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_daily_scrum_update_answers_daily_scrum_update_entry_id_f";
            columns: ["daily_scrum_update_entry_id"];
            isOneToOne: false;
            referencedRelation: "daily_scrum_update_entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_daily_scrum_update_answers_daily_scrum_update_question_i";
            columns: ["daily_scrum_update_question_id"];
            isOneToOne: false;
            referencedRelation: "daily_scrum_update_questions";
            referencedColumns: ["id"];
          }
        ];
      };
      daily_scrum_update_entries: {
        Row: {
          created_at: string;
          daily_scrum_update_form_id: number;
          date: string;
          id: number;
          submitted_user_id: string;
          time_zone: string;
        };
        Insert: {
          created_at?: string;
          daily_scrum_update_form_id: number;
          date: string;
          id?: number;
          submitted_user_id: string;
          time_zone?: string;
        };
        Update: {
          created_at?: string;
          daily_scrum_update_form_id?: number;
          date?: string;
          id?: number;
          submitted_user_id?: string;
          time_zone?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_daily_scrum_update_entries_daily_scrum_update_form_id_fk";
            columns: ["daily_scrum_update_form_id"];
            isOneToOne: false;
            referencedRelation: "daily_scrum_update_forms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_daily_scrum_update_entries_submitted_user_id_fkey";
            columns: ["submitted_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      daily_scrum_update_forms: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          org_id: number;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: number;
          org_id: number;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          org_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_daily_scrum_update_forms_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          }
        ];
      };
      daily_scrum_update_questions: {
        Row: {
          brief_question: string;
          created_at: string;
          description: string | null;
          id: number;
          is_required: boolean;
          max_length: number | null;
          order: number;
          org_daily_scrum_update_form_id: number;
          placeholder: string | null;
          question: string;
        };
        Insert: {
          brief_question: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_required: boolean;
          max_length?: number | null;
          order: number;
          org_daily_scrum_update_form_id: number;
          placeholder?: string | null;
          question: string;
        };
        Update: {
          brief_question?: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_required?: boolean;
          max_length?: number | null;
          order?: number;
          org_daily_scrum_update_form_id?: number;
          placeholder?: string | null;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_daily_scrum_update_questions_org_daily_scrum_update_form";
            columns: ["org_daily_scrum_update_form_id"];
            isOneToOne: false;
            referencedRelation: "daily_scrum_update_forms";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          created_at: string;
          id: number;
          org_id: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          org_id: number;
          updated_at?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          org_id?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_members_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      org_settings: {
        Row: {
          attribute_key: string;
          attribute_value: string;
          created_at: string;
          id: number;
          org_id: number;
        };
        Insert: {
          attribute_key?: string;
          attribute_value?: string;
          created_at?: string;
          id?: number;
          org_id: number;
        };
        Update: {
          attribute_key?: string;
          attribute_value?: string;
          created_at?: string;
          id?: number;
          org_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "public_org_settings_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          }
        ];
      };
      orgs: {
        Row: {
          created_at: string;
          hash_id: string;
          id: number;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          hash_id?: string;
          id?: number;
          name?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          hash_id?: string;
          id?: number;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
          name: string;
          update_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string;
          id: string;
          name?: string;
          update_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          id?: string;
          name?: string;
          update_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
